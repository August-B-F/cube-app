use eframe::egui::{self, ColorImage, TextureHandle};
use std::path::Path;
use std::process::Command;
use std::sync::{Arc, Mutex};

pub struct FileHandler {
    // Keep the audio stream alive globally so it doesn't instantly close!
    _audio_stream: Option<rodio::OutputStream>,
    audio_handle: Option<rodio::OutputStreamHandle>,
}

#[derive(Clone)]
pub enum FileContent {
    Text(String),
    Image(TextureHandle),
    Pdf {
        pages: Vec<TextureHandle>,
    },
    Audio {
        sink: Arc<rodio::Sink>,
        is_playing: bool,
    },
    Video(Arc<Mutex<std::process::Child>>),
    Html(String),
}

impl FileHandler {
    pub fn new() -> Self {
        let (stream, handle) = match rodio::OutputStream::try_default() {
            Ok((s, h)) => (Some(s), Some(h)),
            Err(_) => (None, None),
        };
        Self {
            _audio_stream: stream,
            audio_handle: handle,
        }
    }

    pub fn load_file(&self, ctx: &egui::Context, path: &Path) -> Result<FileContent, String> {
        let extension = path.extension().and_then(|e| e.to_str()).unwrap_or("");

        match extension {
            "txt" => {
                let text = std::fs::read_to_string(path).map_err(|e| e.to_string())?;
                Ok(FileContent::Text(text))
            }
            "html" => {
                let html = std::fs::read_to_string(path).map_err(|e| e.to_string())?;
                Ok(FileContent::Html(html))
            }
            "jpg" | "png" => {
                let image = image::open(path).map_err(|e| e.to_string())?;
                let size = [image.width() as _, image.height() as _];
                let image_buffer = image.to_rgba8();
                let pixels = image_buffer.as_flat_samples();
                
                let color_image = ColorImage::from_rgba_unmultiplied(size, pixels.as_slice());
                let texture = ctx.load_texture(path.to_string_lossy().to_string(), color_image, Default::default());

                Ok(FileContent::Image(texture))
            }
            "pdf" => {
                let temp_dir = std::env::temp_dir().join("cube_pdf_extract");
                let _ = std::fs::remove_dir_all(&temp_dir); // clean old files
                std::fs::create_dir_all(&temp_dir).map_err(|e| e.to_string())?;
                
                let output = Command::new("pdftoppm")
                    .arg("-jpeg")
                    .arg("-scale-to")
                    .arg("1400") // High resolution so Zoom works well
                    .arg(path)
                    .arg(temp_dir.join("page"))
                    .output()
                    .map_err(|e| format!("Failed to run pdftoppm: {}. Is poppler-utils installed?", e))?;
                
                if !output.status.success() {
                    return Err("Failed to extract PDF pages".into());
                }

                let mut pages = Vec::new();
                let mut entries: Vec<_> = std::fs::read_dir(&temp_dir)
                    .unwrap()
                    .filter_map(Result::ok)
                    .collect();
                
                // Sort to ensure correct page order
                entries.sort_by_key(|e| e.path());

                for entry in entries {
                    if let Ok(image) = image::open(entry.path()) {
                        let size = [image.width() as _, image.height() as _];
                        let image_buffer = image.to_rgba8();
                        let pixels = image_buffer.as_flat_samples();
                        
                        let color_image = ColorImage::from_rgba_unmultiplied(size, pixels.as_slice());
                        let texture = ctx.load_texture(entry.path().to_string_lossy().to_string(), color_image, Default::default());
                        pages.push(texture);
                    }
                    let _ = std::fs::remove_file(entry.path());
                }

                Ok(FileContent::Pdf { pages })
            }
            "mp4" => {
                let path_str = path.to_string_lossy().to_string();
                
                // Spawn MPV in the background but track the child process
                let child = Command::new("mpv")
                    .arg("--fs") // fullscreen
                    .arg("--ontop")
                    .arg("--no-terminal")
                    .arg(&path_str)
                    .spawn()
                    .map_err(|e| format!("Failed to start mpv: {}", e))?;
                
                Ok(FileContent::Video(Arc::new(Mutex::new(child))))
            }
            "mp3" => {
                if let Some(handle) = &self.audio_handle {
                    let file = std::fs::File::open(path).map_err(|e| e.to_string())?;
                    let decoder = rodio::Decoder::new(std::io::BufReader::new(file)).map_err(|e| e.to_string())?;
                    
                    let sink = rodio::Sink::try_new(handle).map_err(|e| e.to_string())?;
                    sink.append(decoder);
                    sink.play();
                    
                    Ok(FileContent::Audio {
                        sink: Arc::new(sink),
                        is_playing: true,
                    })
                } else {
                    Err("Audio output not available".into())
                }
            }
            _ => Err("Unsupported file format".into()),
        }
    }
}