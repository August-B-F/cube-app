use eframe::egui::{ColorImage, TextureHandle};
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
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
    pub playback_speed: f32,
    pub last_update: std::time::Instant,
    pub current_pos: Duration,
}

impl AudioState {
    pub fn seek(&mut self, target: Duration, handle: &rodio::OutputStreamHandle) -> Result<(), String> {
        let file = std::fs::File::open(&self.path).map_err(|e| e.to_string())?;
        let decoder = rodio::Decoder::new(std::io::BufReader::new(file)).map_err(|e| e.to_string())?;
        
        self.sink.stop();
        
        let new_sink = rodio::Sink::try_new(handle).map_err(|e| e.to_string())?;
        new_sink.set_speed(self.playback_speed);
        
        use rodio::Source;
        let skipped = decoder.skip_duration(target);
        
        new_sink.append(skipped);
        if self.is_playing {
            new_sink.play();
        } else {
            new_sink.pause();
        }
        
        self.sink = Arc::new(new_sink);
        self.current_pos = target;
        self.last_update = std::time::Instant::now();
        Ok(())
    }
}

// Embedded Video Player State
pub struct VideoState {
    pub path: PathBuf,
    pub texture: Option<TextureHandle>,
    pub rx: std::sync::mpsc::Receiver<ColorImage>,
    pub tx: std::sync::mpsc::SyncSender<ColorImage>,
    pub width: usize,
    pub height: usize,
    pub fps: f32,
    pub duration: f32,
    pub current_time: f32,
    pub current_frame: usize,
    pub is_playing: bool,
    pub audio_sink: Option<Arc<rodio::Sink>>,
    pub last_update: std::time::Instant,
    pub child_process: Option<std::process::Child>,
}

impl VideoState {
    pub fn spawn_ffmpeg(&mut self, start_time: f32) {
        if let Some(mut child) = self.child_process.take() {
            let _ = child.kill();
            let _ = child.wait();
        }
        
        // Clear channel
        while self.rx.try_recv().is_ok() {}

        let path_str = self.path.to_string_lossy().to_string();
        let mut ffmpeg = Command::new("ffmpeg")
            .args([
                "-ss", &start_time.to_string(),
                "-i", &path_str,
                "-f", "image2pipe",
                "-pix_fmt", "rgba",
                "-vcodec", "rawvideo",
                "-"
            ])
            .stdout(Stdio::piped())
            .stderr(Stdio::null())
            .spawn()
            .expect("Failed to spawn ffmpeg for video decoding");

        let mut stdout = ffmpeg.stdout.take().unwrap();
        let tx = self.tx.clone();
        let width = self.width;
        let height = self.height;
        
        std::thread::spawn(move || {
            let frame_size = width * height * 4;
            let mut buf = vec![0u8; frame_size];
            use std::io::Read;
            while stdout.read_exact(&mut buf).is_ok() {
                let img = ColorImage::from_rgba_unmultiplied([width, height], &buf);
                if tx.send(img).is_err() { break; }
            }
        });
        
        self.child_process = Some(ffmpeg);
    }
    
    pub fn seek(&mut self, time: f32, handle: &rodio::OutputStreamHandle) {
        self.current_time = time;
        self.current_frame = (time * self.fps) as usize;
        self.last_update = std::time::Instant::now();
        self.spawn_ffmpeg(time);
        
        if let Some(sink) = &self.audio_sink {
            sink.stop();
            let new_sink = rodio::Sink::try_new(handle).unwrap();
            let temp_audio = std::env::temp_dir().join("cube_audio.wav");
            if let Ok(file) = std::fs::File::open(&temp_audio) {
                if let Ok(decoder) = rodio::Decoder::new(std::io::BufReader::new(file)) {
                    use rodio::Source;
                    let skipped = decoder.skip_duration(std::time::Duration::from_secs_f32(time));
                    new_sink.append(skipped);
                    if self.is_playing {
                        new_sink.play();
                    } else {
                        new_sink.pause();
                    }
                    self.audio_sink = Some(Arc::new(new_sink));
                }
            }
        }
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
    Video(VideoState),
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
                
                let probe = Command::new("ffprobe")
                    .args(["-v", "error", "-select_streams", "v:0", 
                           "-show_entries", "stream=width,height,r_frame_rate,duration", 
                           "-of", "csv=s=x:p=0", &path_str])
                    .output().map_err(|e| format!("ffprobe failed: {}", e))?;
                    
                let out = String::from_utf8_lossy(&probe.stdout);
                let parts: Vec<&str> = out.trim().split('x').collect();
                if parts.len() < 2 { return Err("Could not parse video metadata".into()); }
                
                let width: usize = parts[0].parse().unwrap_or(1280);
                let height: usize = parts[1].parse().unwrap_or(720);
                
                let fps = if parts.len() >= 3 {
                    let fps_parts: Vec<&str> = parts[2].split('/').collect();
                    if fps_parts.len() == 2 {
                        fps_parts[0].parse::<f32>().unwrap_or(30.0) / fps_parts[1].parse::<f32>().unwrap_or(1.0)
                    } else {
                        parts[2].parse().unwrap_or(30.0)
                    }
                } else { 30.0 };
                
                let duration: f32 = if parts.len() >= 4 { parts[3].parse().unwrap_or(0.0) } else { 0.0 };

                let mut audio_sink = None;
                if let Some(handle) = &self.audio_handle {
                    let temp_audio = std::env::temp_dir().join("cube_audio.wav");
                    let _ = Command::new("ffmpeg")
                        .args(["-y", "-i", &path_str, "-q:a", "0", "-map", "a", temp_audio.to_str().unwrap()])
                        .output();
                        
                    if let Ok(file) = std::fs::File::open(&temp_audio) {
                        if let Ok(source) = rodio::Decoder::new(std::io::BufReader::new(file)) {
                            if let Ok(sink) = rodio::Sink::try_new(handle) {
                                sink.append(source);
                                sink.play();
                                audio_sink = Some(Arc::new(sink));
                            }
                        }
                    }
                }

                let (tx, rx) = std::sync::mpsc::sync_channel(15);
                let mut state = VideoState {
                    path: path.to_path_buf(),
                    texture: None,
                    rx, tx, width, height, fps, duration,
                    current_time: 0.0, current_frame: 0,
                    is_playing: true,
                    audio_sink,
                    last_update: std::time::Instant::now(),
                    child_process: None,
                };
                
                state.spawn_ffmpeg(0.0);
                Ok(FileContent::Video(state))
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
                        playback_speed: 1.0,
                        last_update: std::time::Instant::now(),
                        current_pos: Duration::ZERO,
                    }))
                } else {
                    Err("Audio output not available".into())
                }
            }
            _ => Err("Unsupported file format".into()),
        }
    }
}