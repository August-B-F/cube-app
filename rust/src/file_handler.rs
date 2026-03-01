use eframe::egui::{self, ColorImage, TextureHandle};
use std::path::{Path, PathBuf};
use std::process::Command;
use std::sync::{Arc, Mutex};
use std::time::Duration;
use std::collections::HashMap;
use std::io::Read;

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

pub struct VideoState {
    pub rx: std::sync::mpsc::Receiver<ColorImage>,
    pub tx: std::sync::mpsc::SyncSender<ColorImage>,
    pub texture: Option<TextureHandle>,
    pub is_playing: bool,
    pub current_time: f32,
    pub duration: f32,
    pub fps: f32,
    pub width: usize,
    pub height: usize,
    pub last_update: std::time::Instant,
    pub audio_sink: Option<Arc<rodio::Sink>>,
    pub path: PathBuf,
    pub command_child: Arc<Mutex<Option<std::process::Child>>>,
    pub playback_speed: f32,
    pub frame_index: usize,
}

impl Drop for VideoState {
    fn drop(&mut self) {
        if let Ok(mut child_opt) = self.command_child.lock() {
            if let Some(mut child) = child_opt.take() {
                let _ = child.kill();
                let _ = child.wait();
            }
        }
    }
}

impl VideoState {
    pub fn seek(&mut self, target_time: f32, audio_handle: &Option<rodio::OutputStreamHandle>) {
        self.current_time = target_time;
        self.frame_index = (target_time * self.fps) as usize;
        self.last_update = std::time::Instant::now();

        if let Ok(mut child_opt) = self.command_child.lock() {
            if let Some(mut child) = child_opt.take() {
                let _ = child.kill();
                let _ = child.wait();
            }
        }

        while self.rx.try_recv().is_ok() {}

        let path_str = self.path.to_string_lossy().to_string();
        let tx = self.tx.clone();
        let width = self.width;
        let height = self.height;

        let child_res = std::process::Command::new("ffmpeg")
            .args(&["-ss", &target_time.to_string()])
            .args(&["-i", &path_str])
            .args(&["-f", "image2pipe", "-pix_fmt", "rgba", "-vcodec", "rawvideo", "-"])
            .stdout(std::process::Stdio::piped())
            .stderr(std::process::Stdio::null())
            .spawn();

        if let Ok(mut child) = child_res {
            let mut stdout = child.stdout.take().unwrap();
            let child_arc = Arc::new(Mutex::new(Some(child)));
            self.command_child = child_arc.clone();

            std::thread::spawn(move || {
                let frame_size = width * height * 4;
                let mut buffer = vec![0u8; frame_size];
                loop {
                    if let Ok(child_lock) = child_arc.try_lock() {
                        if child_lock.is_none() { break; } 
                    }
                    if stdout.read_exact(&mut buffer).is_err() {
                        break;
                    }
                    let image = ColorImage::from_rgba_unmultiplied([width, height], &buffer);
                    if tx.send(image).is_err() {
                        break;
                    }
                }
            });
        }

        if let Some(sink) = &self.audio_sink {
            sink.stop();
        }
        
        if let Some(handle) = audio_handle {
            if let Ok(file) = std::fs::File::open(&self.path) {
                if let Ok(decoder) = rodio::Decoder::new(std::io::BufReader::new(file)) {
                    if let Ok(new_sink) = rodio::Sink::try_new(handle) {
                        use rodio::Source;
                        let skipped = decoder.skip_duration(std::time::Duration::from_secs_f32(target_time));
                        new_sink.set_speed(self.playback_speed);
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

                let output = std::process::Command::new("ffprobe")
                    .args(&["-v", "error", "-select_streams", "v:0",
                            "-show_entries", "stream=width,height,r_frame_rate,duration",
                            "-of", "default=noprint_wrappers=1:nokey=1"])
                    .arg(&path_str)
                    .output().map_err(|e| format!("Failed to run ffprobe: {}", e))?;

                let out_str = String::from_utf8_lossy(&output.stdout);
                let mut lines = out_str.lines();

                let width: usize = lines.next().unwrap_or("1920").parse().unwrap_or(1920);
                let height: usize = lines.next().unwrap_or("1080").parse().unwrap_or(1080);
                let fps_str = lines.next().unwrap_or("30/1");
                let fps: f32 = if let Some((num, den)) = fps_str.split_once('/') {
                    num.parse::<f32>().unwrap_or(30.0) / den.parse::<f32>().unwrap_or(1.0)
                } else {
                    30.0
                };
                let duration: f32 = lines.next().unwrap_or("0").parse().unwrap_or(0.0);

                let (tx, rx) = std::sync::mpsc::sync_channel(10);

                let mut state = VideoState {
                    rx,
                    tx,
                    texture: None,
                    is_playing: true,
                    current_time: 0.0,
                    duration,
                    fps,
                    width,
                    height,
                    last_update: std::time::Instant::now(),
                    audio_sink: None,
                    path: path.to_path_buf(),
                    command_child: Arc::new(Mutex::new(None)),
                    playback_speed: 1.0,
                    frame_index: 0,
                };

                state.seek(0.0, &self.audio_handle);

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