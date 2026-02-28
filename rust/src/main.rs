mod app;
mod database;
mod file_handler;
mod translations;
mod ui;

use eframe::egui;
use crate::app::CubeApp;

fn main() -> Result<(), eframe::Error> {
    let options = eframe::NativeOptions {
        viewport: egui::ViewportBuilder::default()
            .with_inner_size([1280.0, 720.0])
            .with_title("Cube App"),
        ..Default::default()
    };
    
    eframe::run_native(
        "Cube App",
        options,
        Box::new(|cc| Ok(Box::new(AppWrapper::new(cc)))),
    )
}

struct AppWrapper {
    app: CubeApp,
}

impl AppWrapper {
    fn new(cc: &eframe::CreationContext<'_>) -> Self {
        Self {
            app: CubeApp::new(cc),
        }
    }
}

impl eframe::App for AppWrapper {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        let mut ui = crate::ui::UI::new(&mut self.app);
        ui.render(ctx);
    }
}