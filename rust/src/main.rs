mod app;
mod icons;
mod ui;
mod file_handler;
mod history;
mod translations;

use eframe::{egui, NativeOptions};
use app::CubeApp;

fn main() -> Result<(), eframe::Error> {
    let options = NativeOptions {
        viewport: egui::ViewportBuilder::default()
            .with_inner_size([1920.0, 1080.0])
            .with_fullscreen(true)
            .with_decorations(false),
        ..Default::default()
    };

    eframe::run_native(
        "Cube App",
        options,
        Box::new(|cc| Ok(Box::new(CubeApp::new(cc)))),
    )
}
