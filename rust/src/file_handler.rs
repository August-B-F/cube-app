use eframe::egui::{self, ColorImage, TextureHandle};
use std::path::Path;
use std::process::Command;
use std::sync::Arc;

pub struct FileHandler {
    audio_player: Option<rodio::OutputStream>,
}

#[derive(Clone)]
#[allow(dead_code)]
pub enum FileContent {
    Text(String),
    Image(TextureHandle),
    Pdf {
        pages: Vec<TextureHandle>,
    },
    Audio(()),
    Video,
    Html(String),
}

impl FileHandler {
    pub fn new() -> Self {
        let audio_player = rodio::OutputStream::try_default().ok().map(|(stream, _)| stream);
        Self { audio_player }
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
                
                let color_image = ColorImage::from_rgba_unmultiplied(
                    size,
                    pixels.as_slice(),
                );

                let texture = ctx.load_texture(
                    path.to_string_lossy().to_string(),
                    color_image,
                    Default::default(),
                );

                Ok(FileContent::Image(texture))
            }
            "pdf" => {
                let temp_dir = std::env::temp_dir().join("cube_pdf_extract");
                std::fs::create_dir_all(&temp_dir).map_err(|e| e.to_string())?;
                
                let output = Command::new("pdftoppm")
                    .arg("-jpeg")
                    .arg("-scale-to")
                    .arg("1024")
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
                
                entries.sort_by_key(|e| e.path());

                for entry in entries {
                    if let Ok(image) = image::open(entry.path()) {
                        let size = [image.width() as _, image.height() as _];
                        let image_buffer = image.to_rgba8();
                        let pixels = image_buffer.as_flat_samples();
                        
                        let color_image = ColorImage::from_rgba_unmultiplied(
                            size,
                            pixels.as_slice(),
                        );

                        let texture = ctx.load_texture(
                            entry.path().to_string_lossy().to_string(),
                            color_image,
                            Default::default(),
                        );
                        pages.push(texture);
                    }
                    let _ = std::fs::remove_file(entry.path());
                }

                Ok(FileContent::Pdf { pages })
            }
            "mp4" => {
                let path_str = path.to_string_lossy().to_string();
                
                std::thread::spawn(move || {
                    let _ = Command::new("mpv")
                        .arg("--fs")
                        .arg("--ontop")
                        .arg(&path_str)
                        .output();
                });
                
                Ok(FileContent::Video)
            }
            "mp3" => {
                if let Some(_stream) = &self.audio_player {
                    let file = std::fs::File::open(path).map_err(|e| e.to_string())?;
                    let decoder = rodio::Decoder::new(std::io::BufReader::new(file)).map_err(|e| e.to_string())?;
                    
                    let (_stream_tmp, handle) = rodio::OutputStream::try_default().unwrap();
                    let sink = rodio::Sink::try_new(&handle).unwrap();
                    sink.append(decoder);
                    sink.play();
                    
                    let sink_arc = Arc::new(sink);
                    
                    std::thread::spawn(move || {
                        while !sink_arc.empty() {
                            std::thread::sleep(std::time::Duration::from_millis(100));
                        }
                    });

                    Ok(FileContent::Audio(()))
                } else {
                    Err("Audio output not available".into())
                }
            }
            _ => Err("Unsupported file format".into()),
        }
    }
}