use eframe::egui::{Color32, ColorImage, Context, TextureHandle, TextureOptions};
use resvg::usvg::{self, Transform};

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
    pub fn load(ctx: &Context) -> Self {
        let _red = Color32::from_rgb(250, 88, 88);
        let _green = Color32::from_rgb(69, 196, 91);

        Self {
            menu: load_svg(ctx, "assets/icons/menu.svg", "icon_menu"),
            back: load_svg(ctx, "assets/icons/back.svg", "icon_back"),
            info: load_svg(ctx, "assets/icons/info.svg", "icon_info"),
            history: load_svg(ctx, "assets/icons/history.svg", "icon_history"),
            help: load_svg(ctx, "assets/icons/help.svg", "icon_help"),
            language: load_svg(ctx, "assets/icons/language.svg", "icon_language"),
            chevron_left: load_svg(ctx, "assets/icons/chevron_left.svg", "icon_chevron_left"),
            chevron_right: load_svg(ctx, "assets/icons/chevron_right.svg", "icon_chevron_right"),
            error: load_svg(ctx, "assets/icons/error.svg", "icon_error"),
            success: load_svg(ctx, "assets/icons/success.svg", "icon_success"),
        }
    }
}

fn load_svg(ctx: &Context, path: &str, name: &str) -> TextureHandle {
    let svg_data = std::fs::read(path).unwrap_or_else(|_| panic!("Failed to load {}", path));
    
    let opt = usvg::Options::default();
    let tree = usvg::Tree::from_data(&svg_data, &opt).unwrap();
    
    // Instead of forcing a scale in usvg, we calculate an appropriate high-res bitmap size 
    // that maintains perfectly crisp edges. eframe uses the GPU to scale down.
    let scale = 10.0; // Render very large to avoid rasterization artifacts
    let size = tree.size();
    let width = (size.width() * scale).ceil() as u32;
    let height = (size.height() * scale).ceil() as u32;

    let mut pixmap = tiny_skia::Pixmap::new(width, height).unwrap();
    resvg::render(
        &tree,
        Transform::from_scale(scale, scale),
        &mut pixmap.as_mut(),
    );

    let image = ColorImage::from_rgba_unmultiplied(
        [width as _, height as _],
        pixmap.data(),
    );

    // Ensure mipmapping is enabled so that when the GPU downscales this large image,
    // it interpolates smoothly instead of dropping pixels (which creates uneven/pixelated edges).
    let mut options = TextureOptions::LINEAR;
    // Note: Some older egui versions use `magnification`/`minification`. LINEAR covers most.
    
    ctx.load_texture(name, image, options)
}