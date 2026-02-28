use eframe::egui;
use std::path::PathBuf;
use std::time::{SystemTime, UNIX_EPOCH};

use crate::file_handler::{FileContent, FileHandler};
use crate::history::{History, HistoryItem};
use crate::icons::Icons;
use crate::translations::{Language, Translations};
use crate::ui::UI;

pub struct CubeApp {
    pub grid: [[u8; 5]; 5],
    pub clicked_history: [Option<usize>; 5],

    pub show_tutorial: bool,
    pub show_results: bool,
    pub show_options: bool,
    pub show_history: bool,
    pub show_explanation: bool,
    pub is_loading: bool,

    pub file_handler: FileHandler,
    pub current_file: Option<FileContent>,
    pub current_code: String,
    pub content_folder: PathBuf,

    pub history: History,
    pub language: Language,
    pub translations: Translations,

    pub popups: Vec<Popup>,
    pub pdf_page: usize,
    pub pdf_zoom: f32,

    pub explanation_content: String,
    pub categories: Vec<&'static str>,

    pub icons: Icons,
}

#[derive(Clone)]
#[allow(dead_code)]
pub struct Popup {
    pub id: u64,
    pub message: String,
    pub popup_type: PopupType,
    pub created_at: SystemTime,
}

#[derive(Clone, PartialEq)]
#[allow(dead_code)]
pub enum PopupType {
    Error,
    Success,
}

impl CubeApp {
    pub fn new(cc: &eframe::CreationContext<'_>) -> Self {
        let content_folder = PathBuf::from("/media/arte/2004-2040");

        Self {
            grid: [[0; 5]; 5],
            clicked_history: [None; 5],
            show_tutorial: true,
            show_results: false,
            show_options: false,
            show_history: false,
            show_explanation: false,
            is_loading: false,
            file_handler: FileHandler::new(),
            current_file: None,
            current_code: String::new(),
            content_folder,
            history: History::new(),
            language: Language::English,
            translations: Translations::new(),
            popups: Vec::new(),
            pdf_page: 0,
            pdf_zoom: 1.0,
            explanation_content: String::new(),
            categories: vec![
                "ACTIONS", "DREAMS", "SONGS", "EMOTIONS", "WALKS", "HEARTBEAT",
                "PAINTINGS", "FABLES", "THOUGHTS", "PEOPLE", "TRASH", "NEWS",
                "PLACES", "IDEAS", "POLLUTION", "WEATHER", "CLOUDS", "WIND",
                "ACCOUNTS", "INSIGHTS", "ESSAYS", "TOOLS", "MANUAL", "JOURNAL",
                "PHOTOS", "ORIGINS", "FRIENDS", "FILMS", "THEATER", "LECTURES",
                "ARCHIVE", "EDITIONS", "WEBSITE", "MATRICES", "TEXTURES", "EXHIBITS",
            ],
            icons: Icons::load(&cc.egui_ctx),
        }
    }

    pub fn handle_cell_click(&mut self, row: usize, col: usize) {
        let active_indices: Vec<usize> = self.grid[row]
            .iter()
            .enumerate()
            .filter(|(_, &cell)| cell == 1)
            .map(|(i, _)| i)
            .collect();

        let last_clicked = self.clicked_history[row];

        if self.grid[row][col] == 1 {
            self.grid[row][col] = 0;
            self.clicked_history[row] = None;
        } else if active_indices.len() < 2 {
            self.grid[row][col] = 1;
            self.clicked_history[row] = Some(col);
        } else {
            if let Some(to_deactivate) = active_indices.iter().find(|&&i| Some(i) != last_clicked) {
                self.grid[row][*to_deactivate] = 0;
            }
            self.grid[row][col] = 1;
            self.clicked_history[row] = Some(col);
        }
    }

    pub fn scan_code(&mut self, ctx: &egui::Context) {
        let code_map = [
            ("11000", '0'), ("10100", '1'), ("10010", '2'), ("10001", '3'),
            ("01100", '4'), ("01010", '5'), ("01001", '6'),
            ("00110", '7'), ("00101", '8'), ("00011", '9'),
        ];

        let decoded: String = self.grid.iter().map(|row| {
            let code: String = row.iter().map(|&c| (c + b'0') as char).collect();
            code_map.iter().find(|(p, _)| *p == code).map(|(_, d)| *d).unwrap_or('X')
        }).collect();

        self.current_code = decoded.clone();

        let extensions = ["mp3", "mp4", "txt", "pdf", "jpg", "png", "html"];
        let mut found = false;

        for ext in extensions {
            let file_path = self.content_folder.join(format!("{}.{}", decoded, ext));
            if file_path.exists() {
                self.is_loading = true;
                ctx.request_repaint(); // Show loading spinner
                
                match self.file_handler.load_file(ctx, &file_path) {
                    Ok(content) => {
                        self.current_file = Some(content);
                        self.show_results = true;
                        self.pdf_page = 0;
                        self.pdf_zoom = 1.0;
                        self.is_loading = false;
                        self.history.add_item(HistoryItem {
                            code: decoded.clone(),
                            timestamp: chrono::Utc::now(),
                            result: "Found".to_string(),
                        });
                        self.grid = [[0; 5]; 5];
                        self.clicked_history = [None; 5];
                        found = true;
                        break;
                    }
                    Err(e) => {
                        self.add_popup(format!("Error loading file: {}", e), PopupType::Error);
                        self.is_loading = false;
                    }
                }
            }
        }

        if !found {
            self.add_popup("Project does not exist".to_string(), PopupType::Error);
        }
    }

    pub fn add_popup(&mut self, message: String, popup_type: PopupType) {
        let id = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_millis() as u64;
        self.popups.push(Popup { id, message, popup_type, created_at: SystemTime::now() });
    }

    pub fn update_popups(&mut self) {
        let now = SystemTime::now();
        self.popups.retain(|p| {
            now.duration_since(p.created_at).map(|d| d.as_secs_f32() < 3.5).unwrap_or(false)
        });
    }

    pub fn load_explanation(&mut self, project_code: &str) {
        let suffix = match self.language {
            Language::English => "explanations",
            Language::Italian => "explanations_it",
        };
        let path = PathBuf::from("assets").join(suffix).join(format!("{}.txt", project_code));
        if let Ok(content) = std::fs::read_to_string(&path) {
            self.explanation_content = content.replace('"', "");
            self.show_explanation = true;
        } else {
            self.add_popup("Failed to load explanation".to_string(), PopupType::Error);
        }
    }

    pub fn get_category(&self, project_code: &str) -> &str {
        if project_code.len() >= 2 {
            if let Ok(idx) = project_code[0..2].parse::<usize>() {
                let i = (idx % self.categories.len()).saturating_sub(1);
                return self.categories.get(i).unwrap_or(&"UNKNOWN");
            }
        }
        "UNKNOWN"
    }

    pub fn open_history_project(&mut self, ctx: &egui::Context, code: String) {
        let extensions = ["mp3", "mp4", "txt", "pdf", "jpg", "png", "html"];
        for ext in extensions {
            let file_path = self.content_folder.join(format!("{}.{}", code, ext));
            if file_path.exists() {
                self.is_loading = true;
                ctx.request_repaint();

                match self.file_handler.load_file(ctx, &file_path) {
                    Ok(content) => {
                        self.current_file = Some(content);
                        self.current_code = code;
                        self.show_results = true;
                        self.show_history = false;
                        self.pdf_page = 0;
                        self.pdf_zoom = 1.0;
                        self.is_loading = false;
                        return;
                    }
                    Err(e) => {
                        self.add_popup(format!("Error: {}", e), PopupType::Error);
                        self.is_loading = false;
                    }
                }
            }
        }
        self.add_popup("Project does not exist".to_string(), PopupType::Error);
    }
}

impl eframe::App for CubeApp {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        self.update_popups();

        // Keep repainting while animations or popups are active
        if !self.popups.is_empty() || self.is_loading
            || self.show_tutorial || self.show_options
            || self.show_history || self.show_explanation
        {
            ctx.request_repaint();
        }

        let mut ui_renderer = UI::new(self);
        ui_renderer.render(ctx);
    }
}