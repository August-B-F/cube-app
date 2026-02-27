use eframe::egui::{Color32, ColorImage, Context, TextureHandle};
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
    
    let size = tree.size();
    let width = size.width() as u32;
    let height = size.height() as u32;

    let mut pixmap = tiny_skia::Pixmap::new(width, height).unwrap();
    resvg::render(
        &tree,
        Transform::default(),
        &mut pixmap.as_mut(),
    );

    let image = ColorImage::from_rgba_unmultiplied(
        [width as _, height as _],
        pixmap.data(),
    );

    ctx.load_texture(name, image, Default::default())
}