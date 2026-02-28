use std::path::PathBuf;
use walkdir::WalkDir;

pub struct Database;

impl Database {
    pub fn find_file(code: &str) -> Option<PathBuf> {
        let base_dir = std::env::current_dir()
            .unwrap_or_else(|_| PathBuf::from("."))
            .join("db")
            .join(code);
            
        if !base_dir.exists() || !base_dir.is_dir() {
            return None;
        }

        // Return the first media/text file we find in the folder
        for entry in WalkDir::new(base_dir).into_iter().filter_map(|e| e.ok()) {
            let path = entry.path();
            if path.is_file() {
                if let Some(ext) = path.extension().and_then(|e| e.to_str()) {
                    match ext {
                        "txt" | "jpg" | "png" | "pdf" | "mp4" | "mp3" | "html" => {
                            return Some(path.to_path_buf());
                        }
                        _ => {}
                    }
                }
            }
        }
        
        None
    }
}