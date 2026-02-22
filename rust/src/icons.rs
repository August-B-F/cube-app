// Loads SVG icons at startup into egui textures.
// Each icon is rasterized once to a fixed size and cached as a TextureHandle.

use eframe::egui::{self, ColorImage, TextureHandle, Color32};

/// Rasterize an SVG file (given its bytes) to an RGBA ColorImage at `size x size` pixels.
fn rasterize_svg(svg_bytes: &[u8], size: u32, tint: Color32) -> ColorImage {
    let opt = resvg::usvg::Options::default();
    let tree = resvg::usvg::Tree::from_data(svg_bytes, &opt).expect("Invalid SVG");

    let mut pixmap = tiny_skia::Pixmap::new(size, size).unwrap();

    let svg_size = tree.size();
    let scale_x = size as f32 / svg_size.width();
    let scale_y = size as f32 / svg_size.height();
    let transform = tiny_skia::Transform::from_scale(scale_x, scale_y);

    resvg::render(&tree, transform, &mut pixmap.as_mut());

    let mut pixels = pixmap.take();

    // Apply tint: replace every non-transparent pixel's RGB with the tint color
    for chunk in pixels.chunks_exact_mut(4) {
        if chunk[3] > 0 {
            let alpha = chunk[3] as f32 / 255.0;
            chunk[0] = (tint.r() as f32 * alpha) as u8;
            chunk[1] = (tint.g() as f32 * alpha) as u8;
            chunk[2] = (tint.b() as f32 * alpha) as u8;
        }
    }

    ColorImage::from_rgba_unmultiplied([size as usize, size as usize], &pixels)
}

pub struct Icons {
    pub menu: TextureHandle,
    pub back: TextureHandle,
    pub info: TextureHandle,
    pub history: TextureHandle,
    pub help: TextureHandle,
    pub language: TextureHandle,
    pub chevron_left: TextureHandle,
    pub chevron_right: TextureHandle,
    pub error: TextureHandle,
    pub success: TextureHandle,
}

impl Icons {
    pub fn load(ctx: &egui::Context) -> Self {
        let dark = Color32::from_rgb(29, 27, 32);
        let white = Color32::WHITE;
        let red = Color32::from_rgb(250, 88, 88);
        let green = Color32::from_rgb(69, 196, 91);

        let load = |path: &str, size: u32, tint: Color32| -> TextureHandle {
            let bytes = std::fs::read(path)
                .unwrap_or_else(|_| panic!("Missing icon: {}", path));
            let img = rasterize_svg(&bytes, size, tint);
            ctx.load_texture(path, img, Default::default())
        };

        Self {
            menu:          load("assets/icons/menu.svg",          64, dark),
            back:          load("assets/icons/back.svg",          64, dark),
            info:          load("assets/icons/info.svg",          64, dark),
            history:       load("assets/icons/history.svg",       48, dark),
            help:          load("assets/icons/help.svg",          48, dark),
            language:      load("assets/icons/language.svg",      48, dark),
            chevron_left:  load("assets/icons/chevron_left.svg",  48, dark),
            chevron_right: load("assets/icons/chevron_right.svg", 48, dark),
            error:         load("assets/icons/error.svg",         40, white),
            success:       load("assets/icons/success.svg",       40, white),
        }
    }
}
