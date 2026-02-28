use eframe::egui::{TextureHandle, Context};
use std::collections::VecDeque;
use chrono::{DateTime, Utc};
use crate::file_handler::FileHandler;
use crate::translations::{Translations, Language};

pub struct HistoryItem {
    pub code: String,
    pub timestamp: DateTime<Utc>,
}

pub struct History {
    items: VecDeque<HistoryItem>,
    max_items: usize,
}

impl History {
    pub fn new() -> Self {
        Self {
            items: VecDeque::new(),
            max_items: 20,
        }
    }
    pub fn add(&mut self, code: String) {
        self.items.retain(|i| i.code != code);
        self.items.push_front(HistoryItem {
            code,
            timestamp: Utc::now(),
        });
        if self.items.len() > self.max_items {
            self.items.pop_back();
        }
    }
    pub fn get_items(&self) -> &VecDeque<HistoryItem> {
        &self.items
    }
}

pub struct Icons {
    pub menu: TextureHandle,
    pub history: TextureHandle,
    pub help: TextureHandle,
    pub language: TextureHandle,
    pub back: TextureHandle,
    pub info: TextureHandle,
    pub chevron_left: TextureHandle,
    pub chevron_right: TextureHandle,
    pub error: TextureHandle,
    pub success: TextureHandle,
}

impl Icons {
    pub fn load(ctx: &Context) -> Self {
        let load_svg = |name: &str| -> TextureHandle {
            let path = format!("../assets/icons/{}.svg", name);
            let svg_data = std::fs::read(&path).unwrap_or_else(|_| panic!("Missing {}", path));
            
            let rtree = usvg::Tree::from_data(&svg_data, &usvg::Options::default()).unwrap();
            
            let zoom = 2.0; 
            let pixmap_size = rtree.size().to_int_size().scale_by(zoom).unwrap();
            let mut pixmap = tiny_skia::Pixmap::new(pixmap_size.width(), pixmap_size.height()).unwrap();
            
            let transform = tiny_skia::Transform::from_scale(zoom, zoom);
            resvg::render(&rtree, transform, &mut pixmap.as_mut());

            let color_image = eframe::egui::ColorImage::from_rgba_unmultiplied(
                [pixmap.width() as _, pixmap.height() as _],
                pixmap.data(),
            );
            
            ctx.load_texture(name, color_image, Default::default())
        };

        Self {
            menu: load_svg("menu"),
            history: load_svg("history"),
            help: load_svg("help"),
            language: load_svg("language"),
            back: load_svg("back"),
            info: load_svg("info"),
            chevron_left: load_svg("chevron-left"),
            chevron_right: load_svg("chevron-right"),
            error: load_svg("error"),
            success: load_svg("success"),
        }
    }
}

#[derive(Clone, PartialEq)]
pub enum PopupType {
    Error,
    Success,
}

pub struct Popup {
    pub id: u64,
    pub message: String,
    pub popup_type: PopupType,
    pub created_at: std::time::SystemTime,
}

pub struct CubeApp {
    pub grid: [[u8; 5]; 5],
    pub show_results: bool,
    pub show_tutorial: bool,
    pub show_history: bool,
    pub show_explanation: bool,
    pub show_options: bool,
    pub current_code: String,
    pub history: History,
    pub language: Language,
    pub translations: Translations,
    pub popups: Vec<Popup>,
    pub popup_counter: u64,
    pub icons: Icons,
    
    pub file_handler: FileHandler,
    pub current_file: Option<crate::file_handler::FileContent>,
    pub is_loading: bool,
    pub pdf_page: usize,
    pub pdf_zoom: f32,
    pub explanation_content: String,
    
    pub last_mouse_move: std::time::Instant,
}

impl CubeApp {
    pub fn new(cc: &eframe::CreationContext<'_>) -> Self {
        let icons = Icons::load(&cc.egui_ctx);
        Self {
            grid: [[0; 5]; 5],
            show_results: false,
            show_tutorial: true,
            show_history: false,
            show_explanation: false,
            show_options: false,
            current_code: String::new(),
            history: History::new(),
            language: Language::Italian,
            translations: Translations::new(),
            popups: Vec::new(),
            popup_counter: 0,
            icons,
            file_handler: FileHandler::new(),
            current_file: None,
            is_loading: false,
            pdf_page: 0,
            pdf_zoom: 1.0,
            explanation_content: String::new(),
            last_mouse_move: std::time::Instant::now(),
        }
    }

    pub fn handle_cell_click(&mut self, row: usize, col: usize) {
        self.grid[row][col] = 1 - self.grid[row][col];
    }

    pub fn show_popup(&mut self, message: &str, popup_type: PopupType) {
        self.popup_counter += 1;
        self.popups.push(Popup {
            id: self.popup_counter,
            message: message.to_string(),
            popup_type,
            created_at: std::time::SystemTime::now(),
        });
    }

    pub fn get_category(&self, code: &str) -> &'static str {
        match code.chars().next().unwrap_or('0') {
            '0' => "Arts",
            '1' => "History",
            '2' => "Science",
            '3' => "Technology",
            _ => "General",
        }
    }

    pub fn load_explanation(&mut self, code: &str) {
        let category = self.get_category(code);
        let content = format!(
            "Explanation for {} ({}).\n\n\
            This content is typically loaded from the specific project folder.\n\
            It includes metadata, historical context, and technical details related to the item.\n\n\
            Project ID: {}\n\
            Category: {}",
            code, category, code, category
        );
        self.explanation_content = content;
        self.show_explanation = true;
    }

    pub fn open_history_project(&mut self, ctx: &eframe::egui::Context, code: String) {
        self.current_code = code.clone();
        self.show_history = false;
        self.load_project(ctx, &code);
    }

    pub fn scan_code(&mut self, ctx: &eframe::egui::Context) {
        let mut code = String::new();
        for row in 0..5 {
            for col in 0..5 {
                code.push_str(&self.grid[row][col].to_string());
            }
        }
        let hex_code = format!("{:07X}", u32::from_str_radix(&code, 2).unwrap());
        self.current_code = hex_code.clone();
        self.history.add(hex_code.clone());
        self.load_project(ctx, &hex_code);
    }

    fn load_project(&mut self, ctx: &eframe::egui::Context, code: &str) {
        self.is_loading = true;
        self.show_results = true;
        self.pdf_page = 0;
        self.pdf_zoom = 1.0;
        
        let file_path = crate::database::Database::find_file(code);
        if let Some(path) = file_path {
            match self.file_handler.load_file(ctx, &path) {
                Ok(content) => {
                    self.current_file = Some(content);
                },
                Err(e) => {
                    self.show_popup(&format!("Failed to load file: {}", e), PopupType::Error);
                    self.show_results = false;
                }
            }
        } else {
            let msg = self.translations.get("notFound", self.language).to_string();
            self.show_popup(&msg, PopupType::Error);
            self.show_results = false;
        }
        self.is_loading = false;
        self.grid = [[0; 5]; 5];
    }
}