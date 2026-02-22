use eframe::egui::{self, ColorImage, TextureHandle};
use std::fs;
use std::path::Path;
use std::sync::Arc;
use std::process::Command;

pub struct FileHandler {
    audio_player: Option<Arc<rodio::OutputStreamHandle>>,
    _audio_stream: Option<rodio::OutputStream>,
}

pub enum FileContent {
    Text(String),
    Image(TextureHandle),
    Pdf {
        pages: Vec<TextureHandle>,
        current_page: usize,
    },
    Audio(Arc<rodio::Sink>),
    Video,
    Html(String),
}

impl FileHandler {
    pub fn new() -> Self {
        let (stream, handle) = rodio::OutputStream::try_default()
            .ok()
            .map(|(s, h)| (Some(s), Some(Arc::new(h))))
            .unwrap_or((None, None));
        
        Self {
            audio_player: handle,
            _audio_stream: stream,
        }
    }

    pub fn load_file(&self, ctx: &egui::Context, path: &Path) -> Result<FileContent, String> {
        let extension = path
            .extension()
            .and_then(|e| e.to_str())
            .ok_or_else(|| "No file extension".to_string())?
            .to_lowercase();

        match extension.as_str() {
            "txt" => self.load_text(path),
            "html" => self.load_html(path),
            "jpg" | "jpeg" | "png" => self.load_image(ctx, path),
            "pdf" => self.load_pdf(ctx, path),
            "mp3" => self.load_audio(path),
            "mp4" => self.load_video(path),
            _ => Err(format!("Unsupported file type: {}", extension)),
        }
    }

    fn load_text(&self, path: &Path) -> Result<FileContent, String> {
        fs::read_to_string(path)
            .map(FileContent::Text)
            .map_err(|e| format!("Failed to read text file: {}", e))
    }

    fn load_html(&self, path: &Path) -> Result<FileContent, String> {
        fs::read_to_string(path)
            .map(FileContent::Html)
            .map_err(|e| format!("Failed to read HTML file: {}", e))
    }

    fn load_image(&self, ctx: &egui::Context, path: &Path) -> Result<FileContent, String> {
        let img = image::open(path).map_err(|e| e.to_string())?;
        let size = [img.width() as _, img.height() as _];
        let image_buffer = img.to_rgba8();
        let pixels = image_buffer.as_flat_samples();
        let color_image = ColorImage::from_rgba_unmultiplied(
            size,
            pixels.as_slice(),
        );
        let texture = ctx.load_texture(
            path.to_string_lossy().to_string(),
            color_image,
            egui::TextureOptions::LINEAR
        );
        Ok(FileContent::Image(texture))
    }

    fn load_pdf(&self, ctx: &egui::Context, path: &Path) -> Result<FileContent, String> {
        // Create a unique temporary directory
        let temp_dir = std::env::temp_dir().join(format!(
            "cube_pdf_{}",
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_millis()
        ));
        std::fs::create_dir_all(&temp_dir).map_err(|e| e.to_string())?;

        // Run pdftoppm to extract PDF pages to JPEG
        let status = Command::new("pdftoppm")
            .args(&["-jpeg", "-r", "150"]) // 150 DPI is a good balance of quality/memory
            .arg(path)
            .arg(temp_dir.join("page"))
            .status()
            .map_err(|e| format!("Failed to run pdftoppm (please install poppler-utils): {}", e))?;

        if !status.success() {
            let _ = std::fs::remove_dir_all(&temp_dir);
            return Err("Failed to convert PDF to images. Ensure poppler-utils is installed.".into());
        }

        let mut entries: Vec<_> = fs::read_dir(&temp_dir)
            .map_err(|e| e.to_string())?
            .filter_map(Result::ok)
            .collect();
        
        // Sort files to keep pages in order
        entries.sort_by_cached_key(|e| {
            let name_str = e.file_name().to_string_lossy().to_string();
            // Parses numbers out of "page-1.jpg", "page-02.jpg", etc.
            if let Some(num_str) = name_str.strip_prefix("page-").and_then(|s| s.strip_suffix(".jpg")) {
                num_str.parse::<u32>().unwrap_or(0)
            } else {
                0
            }
        });

        let mut pages = Vec::new();
        for entry in entries {
            let img = image::open(entry.path()).map_err(|e| e.to_string())?;
            let size = [img.width() as _, img.height() as _];
            let color_image = ColorImage::from_rgba_unmultiplied(
                size,
                img.to_rgba8().as_flat_samples().as_slice(),
            );
            let texture = ctx.load_texture(
                entry.path().to_string_lossy().to_string(),
                color_image,
                egui::TextureOptions::LINEAR
            );
            pages.push(texture);
        }

        // Cleanup temp files immediately
        let _ = std::fs::remove_dir_all(temp_dir);

        if pages.is_empty() {
            return Err("PDF conversion produced no pages".into());
        }

        Ok(FileContent::Pdf {
            pages,
            current_page: 0,
        })
    }

    fn load_audio(&self, path: &Path) -> Result<FileContent, String> {
        if let Some(ref handle) = self.audio_player {
            let file = std::fs::File::open(path)
                .map_err(|e| format!("Failed to open audio file: {}", e))?;
            
            let source = rodio::Decoder::new(std::io::BufReader::new(file))
                .map_err(|e| format!("Failed to decode audio: {}", e))?;
            
            let sink = rodio::Sink::try_new(handle)
                .map_err(|e| format!("Failed to create audio sink: {}", e))?;
            
            sink.append(source);
            sink.play();
            
            Ok(FileContent::Audio(Arc::new(sink)))
        } else {
            Err("Audio system not available. Is ALSA/PulseAudio running?".to_string())
        }
    }

    fn load_video(&self, path: &Path) -> Result<FileContent, String> {
        // Launch mpv as a standalone hardware-accelerated player
        Command::new("mpv")
            .arg("--fs") // start fullscreen
            .arg("--ontop") // stay on top of the app
            .arg(path)
            .spawn()
            .map_err(|e| format!("Failed to run mpv (please install mpv): {}", e))?;
        
        Ok(FileContent::Video)
    }
}