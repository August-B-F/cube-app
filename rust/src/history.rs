use serde::{Deserialize, Serialize};
use chrono::{DateTime, Local};
use std::fs;
use std::path::PathBuf;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct HistoryItem {
    pub code: String,
    pub timestamp: DateTime<Local>,
    pub result: String,
}

pub struct History {
    items: Vec<HistoryItem>,
    file_path: PathBuf,
}

impl History {
    pub fn new() -> Self {
        let file_path = PathBuf::from("cube_history.json");
        let items = Self::load_from_file(&file_path).unwrap_or_default();
        
        Self { items, file_path }
    }

    pub fn add_item(&mut self, item: HistoryItem) {
        // Remove duplicate if exists
        self.items.retain(|i| i.code != item.code);
        
        // Add to front
        self.items.insert(0, item);
        
        // Keep only last 100 items
        if self.items.len() > 100 {
            self.items.truncate(100);
        }
        
        // Save to file
        let _ = self.save_to_file();
    }

    pub fn get_items(&self) -> &[HistoryItem] {
        &self.items
    }

    fn load_from_file(path: &PathBuf) -> Result<Vec<HistoryItem>, Box<dyn std::error::Error>> {
        let content = fs::read_to_string(path)?;
        let items = serde_json::from_str(&content)?;
        Ok(items)
    }

    fn save_to_file(&self) -> Result<(), Box<dyn std::error::Error>> {
        let content = serde_json::to_string_pretty(&self.items)?;
        fs::write(&self.file_path, content)?;
        Ok(())
    }
}