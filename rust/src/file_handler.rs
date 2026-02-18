use eframe::egui::ColorImage;
use eframe::egui::TextureHandle;
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::Arc;

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

    pub fn load_file(&self, path: &Path) -> Result<FileContent, String> {
        let extension = path
            .extension()
            .and_then(|e| e.to_str())
            .ok_or_else(|| "No file extension".to_string())?
            .to_lowercase();

        match extension.as_str() {
            "txt" => self.load_text(path),
            "html" => self.load_html(path),
            "jpg" | "jpeg" | "png" => self.load_image(path),
            "pdf" => self.load_pdf(path),
            "mp3" => self.load_audio(path),
            "mp4" => Ok(FileContent::Video),
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

    fn load_image(&self, path: &Path) -> Result<FileContent, String> {
        // Note: This returns a placeholder. Actual image loading requires egui context
        // which should be passed from the app update loop
        Err("Image loading requires egui context".to_string())
    }

    fn load_pdf(&self, path: &Path) -> Result<FileContent, String> {
        // Note: This is a placeholder. PDF rendering is complex and requires
        // integration with pdf-render crate and egui texture creation
        Err("PDF loading not yet implemented".to_string())
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
            Err("Audio system not available".to_string())
        }
    }
}