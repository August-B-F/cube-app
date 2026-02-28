use eframe::egui::{self, ColorImage, TextureHandle};
use std::path::{Path, PathBuf};
use std::process::Command;
use std::sync::{Arc, Mutex};
use std::time::Duration;
use std::collections::HashMap;

pub struct FileHandler {
    _audio_stream: Option<rodio::OutputStream>,
    pub audio_handle: Option<rodio::OutputStreamHandle>,
}

pub struct AudioState {
    pub sink: Arc<rodio::Sink>,
    pub is_playing: bool,
    pub path: PathBuf,
    pub duration: Option<Duration>,
}

impl AudioState {
    pub fn seek(&mut self, target: Duration, handle: &rodio::OutputStreamHandle) -> Result<(), String> {
        let file = std::fs::File::open(&self.path).map_err(|e| e.to_string())?;
        let decoder = rodio::Decoder::new(std::io::BufReader::new(file)).map_err(|e| e.to_string())?;
        
        self.sink.stop();
        
        let new_sink = rodio::Sink::try_new(handle).map_err(|e| e.to_string())?;
        
        use rodio::Source;
        let skipped = decoder.skip_duration(target);
        
        new_sink.append(skipped);
        if self.is_playing {
            new_sink.play();
        } else {
            new_sink.pause();
        }
        
        self.sink = Arc::new(new_sink);
        Ok(())
    }
}

pub struct PdfState {
    pub path: PathBuf,
    pub total_pages: usize,
    pub cached_pages: HashMap<(usize, u32), TextureHandle>,
}

impl PdfState {
    pub fn get_page(&mut self, ctx: &egui::Context, page: usize, zoom: f32) -> Option<TextureHandle> {
        let zoom_level = (zoom * 10.0).round() as u32;

        if let Some(tex) = self.cached_pages.get(&(page, zoom_level)) {
            return Some(tex.clone());
        }

        let dpi = (150.0 * zoom).clamp(150.0, 600.0) as u32;

        let temp_dir = std::env::temp_dir().join("cube_pdf_extract_dyn");
        let _ = std::fs::create_dir_all(&temp_dir);
        let out_prefix = temp_dir.join(format!("page_{}_{}", page, dpi));
        
        let output = Command::new("pdftoppm")
            .arg("-jpeg")
            .arg("-r")
            .arg(dpi.to_string())
            .arg("-f")
            .arg((page + 1).to_string())
            .arg("-l")
            .arg((page + 1).to_string())
            .arg(&self.path)
            .arg(&out_prefix)
            .output();

        if let Ok(output) = output {
            if output.status.success() {
                if let Ok(entries) = std::fs::read_dir(&temp_dir) {
                    for entry in entries.filter_map(Result::ok) {
                        let path = entry.path();
                        if path.to_string_lossy().contains(out_prefix.file_name().unwrap().to_str().unwrap()) {
                            if let Ok(image) = image::open(&path) {
                                let size = [image.width() as _, image.height() as _];
                                let image_buffer = image.to_rgba8();
                                let pixels = image_buffer.as_flat_samples();
                                
                                let color_image = ColorImage::from_rgba_unmultiplied(size, pixels.as_slice());
                                let texture = ctx.load_texture(
                                    format!("pdf_p{}_z{}", page, zoom_level), 
                                    color_image, 
                                    Default::default()
                                );
                                
                                self.cached_pages.insert((page, zoom_level), texture.clone());
                                let _ = std::fs::remove_file(path);
                                return Some(texture);
                            }
                        }
                    }
                }
            }
        }
        
        None
    }
}

pub enum FileContent {
    Text(String),
    Image(TextureHandle),
    Pdf(PdfState),
    Audio(AudioState),
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
                let output = Command::new("pdfinfo")
                    .arg(path)
                    .output()
                    .map_err(|e| format!("Failed to run pdfinfo: {}", e))?;
                
                let mut total_pages = 1;
                if output.status.success() {
                    let out_str = String::from_utf8_lossy(&output.stdout);
                    for line in out_str.lines() {
                        if line.starts_with("Pages:") {
                            if let Some(num_str) = line.split(':').nth(1) {
                                if let Ok(n) = num_str.trim().parse::<usize>() {
                                    total_pages = n;
                                }
                            }
                        }
                    }
                }

                Ok(FileContent::Pdf(PdfState {
                    path: path.to_path_buf(),
                    total_pages,
                    cached_pages: HashMap::new(),
                }))
            }
            "mp4" => {
                let path_str = path.to_string_lossy().to_string();
                
                let child = Command::new("mpv")
                    .arg("--fs")
                    .arg("--ontop")
                    .arg("--no-terminal")
                    .arg("--force-window=immediate")
                    .arg(&path_str)
                    .spawn()
                    .map_err(|e| format!("Failed to start mpv: {}", e))?;
                
                Ok(FileContent::Video(Arc::new(Mutex::new(child))))
            }
            "mp3" => {
                if let Some(handle) = &self.audio_handle {
                    let file = std::fs::File::open(path).map_err(|e| e.to_string())?;
                    let source = rodio::Decoder::new(std::io::BufReader::new(file)).map_err(|e| e.to_string())?;
                    
                    use rodio::Source;
                    let duration = source.total_duration();
                    
                    let sink = rodio::Sink::try_new(handle).map_err(|e| e.to_string())?;
                    sink.append(source);
                    sink.play();
                    
                    Ok(FileContent::Audio(AudioState {
                        sink: Arc::new(sink),
                        is_playing: true,
                        path: path.to_path_buf(),
                        duration,
                    }))
                } else {
                    Err("Audio output not available".into())
                }
            }
            _ => Err("Unsupported file format".into()),
        }
    }
}