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
    pub pending_requests: std::collections::HashSet<(usize, u32)>,
    pub rx: std::sync::mpsc::Receiver<((usize, u32), ColorImage)>,
    pub tx: std::sync::mpsc::Sender<((usize, u32), ColorImage)>,
    pub latest_request: Arc<Mutex<(usize, u32)>>,
}

impl PdfState {
    pub fn new(path: PathBuf, total_pages: usize) -> Self {
        let (tx, rx) = std::sync::mpsc::channel();
        Self {
            path,
            total_pages,
            cached_pages: HashMap::new(),
            pending_requests: std::collections::HashSet::new(),
            rx,
            tx,
            latest_request: Arc::new(Mutex::new((0, 0))),
        }
    }

    pub fn get_page(&mut self, ctx: &egui::Context, page: usize, zoom: f32) -> Option<TextureHandle> {
        let zoom_level = (zoom * 10.0).round() as u32;

        if let Ok(mut latest) = self.latest_request.lock() {
            *latest = (page, zoom_level);
        }

        while let Ok(((p, z), color_image)) = self.rx.try_recv() {
            let texture = ctx.load_texture(
                format!("pdf_p{}_z{}", p, z), 
                color_image, 
                Default::default()
            );
            self.cached_pages.insert((p, z), texture);
            self.pending_requests.remove(&(p, z));
            ctx.request_repaint(); 
        }

        if let Some(tex) = self.cached_pages.get(&(page, zoom_level)) {
            return Some(tex.clone());
        }

        if !self.pending_requests.contains(&(page, zoom_level)) {
            self.pending_requests.insert((page, zoom_level));
            
            let tx = self.tx.clone();
            let path = self.path.clone();
            let ctx_clone = ctx.clone();
            let latest_req_clone = self.latest_request.clone();

            // Pushing the max limits of OpenGL texture support (usually 16384). 
            // This is double what we had before, ensuring massive crispness at 10x zoom.
            let max_pixels = (2400.0 * zoom).clamp(2400.0, 16000.0) as u32;

            std::thread::spawn(move || {
                if let Ok(latest) = latest_req_clone.lock() {
                    if *latest != (page, zoom_level) { return; }
                }

                let output = Command::new("pdftoppm")
                    .arg("-jpeg")
                    .arg("-scale-to")
                    .arg(max_pixels.to_string())
                    .arg("-cropbox")
                    .arg("-f")
                    .arg((page + 1).to_string())
                    .arg("-l")
                    .arg((page + 1).to_string())
                    .arg(&path)
                    .output();

                if let Ok(output) = output {
                    if output.status.success() {
                        if let Ok(latest) = latest_req_clone.lock() {
                            if *latest != (page, zoom_level) { return; }
                        }

                        if let Ok(image) = image::load_from_memory(&output.stdout) {
                            let size = [image.width() as _, image.height() as _];
                            let image_buffer = image.to_rgba8();
                            let pixels = image_buffer.as_flat_samples();
                            let color_image = ColorImage::from_rgba_unmultiplied(size, pixels.as_slice());
                            
                            let _ = tx.send(((page, zoom_level), color_image));
                            ctx_clone.request_repaint();
                        }
                    }
                }
            });
        }
        
        let mut best_fallback = None;
        let mut closest_diff = u32::MAX;

        for (&(p, z), tex) in &self.cached_pages {
            if p == page {
                let diff = (z as i32 - zoom_level as i32).abs() as u32;
                if diff < closest_diff {
                    closest_diff = diff;
                    best_fallback = Some(tex.clone());
                }
            }
        }
        
        best_fallback
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

                Ok(FileContent::Pdf(PdfState::new(path.to_path_buf(), total_pages)))
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