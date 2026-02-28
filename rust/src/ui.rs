use eframe::egui::{self, Color32, Pos2, Rect, Sense, Vec2, Rounding, Stroke, Margin, Id};
use crate::app::{CubeApp, PopupType};

const BACKGROUND_COLOR: Color32 = Color32::from_rgb(236, 230, 240);
const ACTION_BUTTON_COLOR: Color32 = Color32::from_rgb(101, 85, 143);
const BUTTON_COLOR: Color32 = Color32::from_rgb(29, 27, 32);
const PRIMARY_TEXT_COLOR: Color32 = Color32::from_rgb(29, 27, 32);
const SECONDARY_TEXT_COLOR: Color32 = Color32::from_rgb(73, 69, 79);
const SECONDARY_BUTTON_BG: Color32 = Color32::from_rgb(218, 207, 216);

pub struct UI<'a> {
    app: &'a mut CubeApp,
}

impl<'a> UI<'a> {
    pub fn new(app: &'a mut CubeApp) -> Self {
        Self { app }
    }

    pub fn render(&mut self, ctx: &egui::Context) {
        let mut style = (*ctx.style()).clone();
        style.visuals.window_fill = BACKGROUND_COLOR;
        style.visuals.panel_fill = BACKGROUND_COLOR;
        style.visuals.override_text_color = Some(PRIMARY_TEXT_COLOR);
        style.visuals.widgets.noninteractive.bg_fill = BACKGROUND_COLOR;
        
        style.visuals.widgets.inactive.bg_fill = Color32::TRANSPARENT;
        style.visuals.widgets.inactive.bg_stroke = Stroke::NONE;
        style.visuals.widgets.hovered.bg_fill = Color32::from_black_alpha(15);
        style.visuals.widgets.hovered.bg_stroke = Stroke::NONE;
        style.visuals.widgets.active.bg_fill = Color32::from_black_alpha(30);
        style.visuals.widgets.active.bg_stroke = Stroke::NONE;
        
        style.spacing.scroll.bar_width = 0.0;
        style.spacing.scroll.handle_min_length = 0.0;
        style.spacing.scroll.bar_inner_margin = 0.0;
        style.spacing.scroll.bar_outer_margin = 0.0;
        
        style.visuals.widgets.inactive.bg_fill = Color32::TRANSPARENT;
        style.visuals.widgets.hovered.bg_fill = Color32::TRANSPARENT;
        style.visuals.widgets.active.bg_fill = Color32::TRANSPARENT;
        style.visuals.widgets.noninteractive.bg_fill = Color32::TRANSPARENT;
        
        ctx.set_style(style);

        if self.app.show_results {
            self.render_results(ctx);
        } else {
            self.render_grid(ctx);
        }

        let tut_anim = ctx.animate_bool_with_time(Id::new("tut_anim"), self.app.show_tutorial, 0.25);
        if tut_anim > 0.0 { self.render_tutorial(ctx, tut_anim); }

        let hist_anim = ctx.animate_bool_with_time(Id::new("hist_anim"), self.app.show_history, 0.25);
        if hist_anim > 0.0 { self.render_history(ctx, hist_anim); }

        let exp_anim = ctx.animate_bool_with_time(Id::new("exp_anim"), self.app.show_explanation, 0.25);
        if exp_anim > 0.0 { self.render_explanation(ctx, exp_anim); }

        let opt_anim = ctx.animate_bool_with_time(Id::new("opt_anim"), self.app.show_options, 0.25);
        if opt_anim > 0.0 { self.render_options(ctx, opt_anim); }

        self.render_popups(ctx);
    }

    fn icon_btn(
        ui: &mut egui::Ui,
        texture: &egui::TextureHandle,
        size: f32,
        bg: Color32,
        rounding: f32,
    ) -> bool {
        let (rect, response) = ui.allocate_exact_size(Vec2::splat(size), Sense::click());
        let hover_col = if response.hovered() || response.is_pointer_button_down_on() {
            Color32::from_black_alpha(25)
        } else {
            Color32::TRANSPARENT
        };
        let bg_col = if bg == Color32::TRANSPARENT { hover_col } else { bg };
        ui.painter().rect_filled(rect, Rounding::same(rounding), bg_col);
        let img_rect = Rect::from_center_size(rect.center(), Vec2::splat(size * 0.6));
        ui.painter().image(
            texture.id(),
            img_rect,
            egui::Rect::from_min_max(Pos2::ZERO, Pos2::new(1.0, 1.0)),
            Color32::WHITE,
        );
        response.clicked()
    }

    fn render_grid(&mut self, ctx: &egui::Context) {
        let scan_text = self.app.translations.get("scan", self.app.language).to_string();
        let menu_tex = self.app.icons.menu.clone();

        egui::CentralPanel::default().show(ctx, |ui| {
            let mut style = (*ctx.style()).clone();
            style.visuals.widgets.hovered.bg_fill = Color32::from_black_alpha(15);
            style.visuals.widgets.active.bg_fill = Color32::from_black_alpha(30);
            ui.set_style(style);

            egui::Area::new(Id::new("options_btn_area"))
                .order(egui::Order::Foreground)
                .anchor(egui::Align2::RIGHT_TOP, [-50.0, 50.0])
                .show(ctx, |ui| {
                    if Self::icon_btn(ui, &menu_tex, 60.0, Color32::TRANSPARENT, 12.0) {
                        self.app.show_options = true;
                    }
                });

            let grid_w = 5.0 * 100.0 + 4.0 * 30.0;
            let grid_h = 5.0 * 100.0 + 4.0 * 30.0 + 40.0 + 73.0;
            let avail = ui.available_size();
            let x_pad = (avail.x - grid_w).max(0.0) / 2.0;
            let y_pad = (avail.y - grid_h).max(0.0) / 2.0;

            ui.add_space(y_pad);
            ui.horizontal(|ui| {
                ui.add_space(x_pad);
                ui.vertical(|ui| {
                    egui::Grid::new("cube_grid")
                        .spacing([30.0, 30.0])
                        .show(ui, |ui| {
                            for row in 0..5 {
                                for col in 0..5 {
                                    let is_active = self.app.grid[row][col] == 1;
                                    let anim_id = Id::new("ca").with(row).with(col);
                                    let t = ctx.animate_bool_with_time(anim_id, is_active, 0.25);

                                    let (rect, response) = ui.allocate_exact_size(
                                        Vec2::splat(100.0), Sense::click(),
                                    );
                                    if response.clicked() { self.app.handle_cell_click(row, col); }

                                    let hover_t = ctx.animate_value_with_time(
                                        Id::new("ch").with(row).with(col),
                                        if response.hovered() { 1.05 } else { 1.0 },
                                        0.15,
                                    );
                                    let r = Rect::from_center_size(rect.center(), rect.size() * hover_t);

                                    let fill = {
                                        let [fr, fg, fb, _] = BUTTON_COLOR.to_array();
                                        let [br, bg_c, bb, _] = BACKGROUND_COLOR.to_array();
                                        let r_ch = (fr as f32 + (br as f32 - fr as f32) * t) as u8;
                                        let g_ch = (fg as f32 + (bg_c as f32 - fg as f32) * t) as u8;
                                        let b_ch = (fb as f32 + (bb as f32 - fb as f32) * t) as u8;
                                        Color32::from_rgb(r_ch, g_ch, b_ch)
                                    };
                                    let stroke_w = 5.0 * t;

                                    ui.painter().rect(
                                        r,
                                        Rounding::same(10.0),
                                        fill,
                                        Stroke::new(stroke_w, BUTTON_COLOR),
                                    );
                                }
                                ui.end_row();
                            }
                        });

                    ui.add_space(40.0);

                    ui.horizontal(|ui| {
                        ui.add_space((grid_w - 456.0) / 2.0);
                        let (rect, response) = ui.allocate_exact_size(
                            Vec2::new(456.0, 73.0), Sense::click(),
                        );
                        if response.clicked() { self.app.scan_code(ctx); }

                        let ht = ctx.animate_value_with_time(
                            Id::new("scan_hover"),
                            if response.hovered() { 1.02 } else { 1.0 },
                            0.15,
                        );
                        let sr = Rect::from_center_size(rect.center(), rect.size() * ht);
                        ui.painter().rect_stroke(sr, Rounding::same(10.0), Stroke::new(5.0, BUTTON_COLOR));
                        ui.painter().text(
                            sr.center(), egui::Align2::CENTER_CENTER,
                            &scan_text, egui::FontId::proportional(24.0), BUTTON_COLOR,
                        );
                    });
                });
            });
        });
    }

    fn render_tutorial(&mut self, ctx: &egui::Context, anim: f32) {
        let welcome = self.app.translations.get("welcome", self.app.language).to_string();
        let tutorial = self.app.translations.get("tutorial", self.app.language).to_string();
        let skip    = self.app.translations.get("skip",     self.app.language).to_string();
        let next    = self.app.translations.get("next",     self.app.language).to_string();

        egui::Area::new(Id::new("tut_bg"))
            .order(egui::Order::Foreground)
            .fixed_pos(Pos2::ZERO)
            .show(ctx, |ui| {
                ui.painter().rect_filled(
                    ctx.screen_rect(), 0.0,
                    Color32::from_black_alpha((120.0 * anim) as u8),
                );
            });

        egui::Area::new(Id::new("tut_content"))
            .order(egui::Order::Tooltip)
            .anchor(egui::Align2::CENTER_CENTER, [0.0, 24.0 * (1.0 - anim)])
            .show(ctx, |ui| {
                ui.multiply_opacity(anim);
                egui::Frame::none()
                    .fill(BACKGROUND_COLOR)
                    .rounding(Rounding::same(28.0))
                    .inner_margin(Margin::same(40.0))
                    .show(ui, |ui| {
                        ui.set_width(480.0);
                        ui.label(egui::RichText::new(&welcome).size(32.0).strong().color(PRIMARY_TEXT_COLOR));
                        ui.add_space(14.0);
                        ui.label(egui::RichText::new(&tutorial).size(20.0).color(PRIMARY_TEXT_COLOR));
                        ui.add_space(32.0);
                        ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                            let mut style = (*ctx.style()).clone();
                            style.visuals.widgets.hovered.bg_fill = Color32::from_black_alpha(15);
                            ui.set_style(style);

                            let btn_next = egui::Button::new(
                                egui::RichText::new(&next).size(22.0).color(ACTION_BUTTON_COLOR)
                            ).frame(false);
                            if ui.add(btn_next).clicked() { self.app.show_tutorial = false; }
                            ui.add_space(24.0);
                            let btn_skip = egui::Button::new(
                                egui::RichText::new(&skip).size(22.0).color(ACTION_BUTTON_COLOR)
                            ).frame(false);
                            if ui.add(btn_skip).clicked() { self.app.show_tutorial = false; }
                        });
                    });
            });
    }

    fn render_options(&mut self, ctx: &egui::Context, anim: f32) {
        let history_str  = self.app.translations.get("history",  self.app.language).to_string();
        let help_str     = self.app.translations.get("help",     self.app.language).to_string();
        let lang_str     = self.app.translations.get("language", self.app.language).to_string();

        let hist_tex = self.app.icons.history.clone();
        let help_tex = self.app.icons.help.clone();
        let lang_tex = self.app.icons.language.clone();

        egui::Area::new(Id::new("opt_bg"))
            .order(egui::Order::Foreground)
            .fixed_pos(Pos2::ZERO)
            .show(ctx, |ui| {
                let r = ui.allocate_response(ctx.screen_rect().size(), Sense::click());
                if r.clicked() { self.app.show_options = false; }
                ui.painter().rect_filled(
                    ctx.screen_rect(), 0.0,
                    Color32::from_black_alpha((80.0 * anim) as u8),
                );
            });

        egui::Area::new(Id::new("opt_card"))
            .order(egui::Order::Tooltip)
            .anchor(egui::Align2::RIGHT_TOP, [-50.0, 50.0 + 24.0 * (1.0 - anim)])
            .show(ctx, |ui| {
                ui.multiply_opacity(anim);
                egui::Frame::none()
                    .fill(BACKGROUND_COLOR)
                    .rounding(Rounding::same(20.0))
                    .shadow(egui::epaint::Shadow {
                        offset: egui::Vec2::new(0.0, 4.0),
                        blur: 24.0,
                        spread: 0.0,
                        color: Color32::from_black_alpha(60),
                    })
                    .inner_margin(Margin::same(12.0))
                    .show(ui, |ui| {
                        ui.interact(ui.max_rect(), Id::new("opt_block"), Sense::click());
                        ui.set_width(280.0);

                        let row = |ui: &mut egui::Ui, tex: &egui::TextureHandle, label: &str| -> bool {
                            let (rect, resp) = ui.allocate_exact_size(Vec2::new(256.0, 72.0), Sense::click());
                            let bg = if resp.hovered() { Color32::from_black_alpha(12) } else { Color32::TRANSPARENT };
                            ui.painter().rect_filled(rect, Rounding::same(12.0), bg);

                            let icon_rect = Rect::from_min_size(
                                rect.min + egui::vec2(16.0, (72.0 - 32.0) / 2.0),
                                Vec2::splat(32.0),
                            );
                            ui.painter().image(
                                tex.id(), icon_rect,
                                egui::Rect::from_min_max(Pos2::ZERO, Pos2::new(1.0, 1.0)),
                                Color32::WHITE,
                            );

                            ui.painter().text(
                                Pos2::new(rect.min.x + 64.0, rect.center().y),
                                egui::Align2::LEFT_CENTER,
                                label,
                                egui::FontId::proportional(26.0),
                                PRIMARY_TEXT_COLOR,
                            );
                            resp.clicked()
                        };

                        if row(ui, &hist_tex, &history_str) {
                            self.app.show_history = true;
                            self.app.show_options = false;
                        }
                        ui.add_space(4.0);
                        if row(ui, &help_tex, &help_str) {
                            self.app.show_tutorial = true;
                            self.app.show_options = false;
                        }
                        ui.add_space(4.0);
                        if row(ui, &lang_tex, &lang_str) {
                            use crate::translations::Language;
                            self.app.language = match self.app.language {
                                Language::English => Language::Italian,
                                Language::Italian => Language::English,
                            };
                        }
                    });
            });
    }

    fn render_history(&mut self, ctx: &egui::Context, anim: f32) {
        egui::Area::new(Id::new("hist_bg"))
            .order(egui::Order::Foreground)
            .fixed_pos(Pos2::ZERO)
            .show(ctx, |ui| {
                let r = ui.allocate_response(ctx.screen_rect().size(), Sense::click());
                if r.clicked() { self.app.show_history = false; }
                ui.painter().rect_filled(
                    ctx.screen_rect(), 0.0,
                    Color32::from_black_alpha((120.0 * anim) as u8),
                );
            });

        let mut open_code: Option<String> = None;

        egui::Area::new(Id::new("hist_card"))
            .order(egui::Order::Tooltip)
            .anchor(egui::Align2::CENTER_CENTER, [0.0, 24.0 * (1.0 - anim)])
            .show(ctx, |ui| {
                ui.multiply_opacity(anim);
                egui::Frame::none()
                    .fill(BACKGROUND_COLOR)
                    .rounding(Rounding::same(24.0))
                    .inner_margin(Margin::same(40.0))
                    .show(ui, |ui| {
                        ui.interact(ui.max_rect(), Id::new("hist_block"), Sense::click());
                        ui.set_width(520.0);

                        let title = self.app.translations.get("history", self.app.language).to_string();
                        ui.label(egui::RichText::new(&title).size(32.0).strong().color(PRIMARY_TEXT_COLOR));
                        ui.add_space(20.0);

                        egui::ScrollArea::vertical().max_height(420.0).show(ui, |ui| {
                            let items = self.app.history.get_items();
                            if items.is_empty() {
                                ui.label(
                                    egui::RichText::new(self.app.translations.get("historyEmpty", self.app.language))
                                        .size(20.0).color(SECONDARY_TEXT_COLOR)
                                );
                            } else {
                                for item in items {
                                    let (row_rect, row_resp) = ui.allocate_exact_size(
                                        Vec2::new(440.0, 56.0), Sense::click(),
                                    );
                                    let bg = if row_resp.hovered() { Color32::from_black_alpha(10) } else { Color32::TRANSPARENT };
                                    ui.painter().rect_filled(row_rect, Rounding::same(8.0), bg);
                                    ui.painter().text(
                                        row_rect.min + egui::vec2(12.0, 28.0),
                                        egui::Align2::LEFT_CENTER,
                                        &item.code,
                                        egui::FontId::proportional(22.0),
                                        PRIMARY_TEXT_COLOR,
                                    );
                                    let local_time = item.timestamp.with_timezone(&chrono::Local);
                                    ui.painter().text(
                                        row_rect.right_center() - egui::vec2(12.0, 0.0),
                                        egui::Align2::RIGHT_CENTER,
                                        local_time.format("%H:%M:%S").to_string(),
                                        egui::FontId::proportional(18.0),
                                        SECONDARY_TEXT_COLOR,
                                    );
                                    ui.painter().line_segment(
                                        [
                                            Pos2::new(row_rect.min.x, row_rect.max.y),
                                            Pos2::new(row_rect.max.x, row_rect.max.y),
                                        ],
                                        Stroke::new(0.5, Color32::from_gray(180)),
                                    );
                                    if row_resp.clicked() { open_code = Some(item.code.clone()); }
                                }
                            }
                        });

                        ui.add_space(30.0);
                        let close_str = self.app.translations.get("close", self.app.language).to_string();
                        let mut style = (*ctx.style()).clone();
                        style.visuals.widgets.inactive.bg_fill = ACTION_BUTTON_COLOR;
                        style.visuals.widgets.hovered.bg_fill = ACTION_BUTTON_COLOR.linear_multiply(0.8);
                        ui.style_mut().visuals = style.visuals;
                        
                        let close_btn = egui::Button::new(
                            egui::RichText::new(&close_str).size(22.0).color(Color32::WHITE)
                        ).rounding(Rounding::same(10.0));
                        if ui.add_sized([120.0, 52.0], close_btn).clicked() {
                            self.app.show_history = false;
                        }
                    });
            });

        if let Some(code) = open_code {
            self.app.open_history_project(ctx, code);
        }
    }

    fn render_explanation(&mut self, ctx: &egui::Context, anim: f32) {
        egui::Area::new(Id::new("exp_bg"))
            .order(egui::Order::Foreground)
            .fixed_pos(Pos2::ZERO)
            .show(ctx, |ui| {
                let r = ui.allocate_response(ctx.screen_rect().size(), Sense::click());
                if r.clicked() { self.app.show_explanation = false; }
                ui.painter().rect_filled(
                    ctx.screen_rect(), 0.0,
                    Color32::from_black_alpha((180.0 * anim) as u8),
                );
            });

        egui::Area::new(Id::new("exp_card"))
            .order(egui::Order::Tooltip)
            .anchor(egui::Align2::CENTER_CENTER, [0.0, 24.0 * (1.0 - anim)])
            .show(ctx, |ui| {
                ui.multiply_opacity(anim);
                egui::Frame::none()
                    .fill(BACKGROUND_COLOR)
                    .rounding(Rounding::same(20.0))
                    .inner_margin(Margin::same(40.0))
                    .show(ui, |ui| {
                        ui.interact(ui.max_rect(), Id::new("exp_block"), Sense::click());
                        ui.set_max_width(ctx.screen_rect().width() * 0.65);
                        ui.set_max_height(ctx.screen_rect().height() * 0.85);

                        let cat = self.app.get_category(&self.app.current_code).to_string();
                        ui.label(
                            egui::RichText::new(format!("{}: {}", cat, self.app.current_code))
                                .size(32.0).strong().color(PRIMARY_TEXT_COLOR)
                        );
                        ui.add_space(16.0);
                        egui::ScrollArea::vertical().show(ui, |ui| {
                            ui.label(
                                egui::RichText::new(&self.app.explanation_content)
                                    .size(20.0).color(PRIMARY_TEXT_COLOR)
                            );
                        });
                        ui.add_space(30.0);
                        let close_str = self.app.translations.get("close", self.app.language).to_string();
                        let mut style = (*ctx.style()).clone();
                        style.visuals.widgets.inactive.bg_fill = ACTION_BUTTON_COLOR;
                        style.visuals.widgets.hovered.bg_fill = ACTION_BUTTON_COLOR.linear_multiply(0.8);
                        ui.style_mut().visuals = style.visuals;

                        let close_btn = egui::Button::new(
                            egui::RichText::new(&close_str).size(22.0).color(Color32::WHITE)
                        ).rounding(Rounding::same(10.0));
                        if ui.add_sized([120.0, 52.0], close_btn).clicked() {
                            self.app.show_explanation = false;
                        }
                    });
            });
    }

    fn render_results(&mut self, ctx: &egui::Context) {
        let back_tex = self.app.icons.back.clone();
        let info_tex = self.app.icons.info.clone();
        let cl_tex   = self.app.icons.chevron_left.clone();
        let cr_tex   = self.app.icons.chevron_right.clone();

        let audio_handle = self.app.file_handler.audio_handle.clone();

        egui::CentralPanel::default().show(ctx, |ui| {
            let mut style = (*ctx.style()).clone();
            style.visuals.widgets.hovered.bg_fill = Color32::from_black_alpha(15);
            style.visuals.widgets.active.bg_fill = Color32::from_black_alpha(30);
            ui.set_style(style);
            
            // --- TOP NAVIGATION ---
            egui::Area::new(Id::new("back_area"))
                .order(egui::Order::Foreground)
                .anchor(egui::Align2::LEFT_TOP, [34.0, 34.0])
                .show(ctx, |ui| {
                    if Self::icon_btn(ui, &back_tex, 56.0, SECONDARY_BUTTON_BG, 12.0) {
                        use crate::file_handler::FileContent;
                        if let Some(FileContent::Video(child_arc)) = &self.app.current_file {
                            if let Ok(mut child) = child_arc.lock() {
                                let _ = child.kill();
                                let _ = child.wait();
                            }
                        } else if let Some(FileContent::Audio(state)) = &self.app.current_file {
                            state.sink.stop();
                        }
                        self.app.show_results = false;
                        self.app.current_file = None;
                        self.app.pdf_page = 0;
                    }
                });

            egui::Area::new(Id::new("info_area"))
                .order(egui::Order::Foreground)
                .anchor(egui::Align2::RIGHT_TOP, [-34.0, 34.0])
                .show(ctx, |ui| {
                    if Self::icon_btn(ui, &info_tex, 56.0, SECONDARY_BUTTON_BG, 12.0) {
                        let project_code = self.app.current_code.clone();
                        self.app.load_explanation(&project_code);
                    }
                });

            if self.app.is_loading {
                ui.vertical_centered(|ui| {
                    ui.add_space(ui.available_height() / 2.0);
                    ui.spinner();
                });
            } else {
                let page = self.app.pdf_page;
                let mut prev = false;
                let mut next = false;
                let mut pdf_zoom_delta = 0.0;

                if let Some(content) = &mut self.app.current_file {
                    use crate::file_handler::FileContent;
                    match content {
                        FileContent::Text(t) => {
                            ui.vertical_centered(|ui| {
                                egui::ScrollArea::vertical().show(ui, |ui| {
                                    ui.add_space(100.0);
                                    ui.label(egui::RichText::new(t.as_str()).size(20.0).color(PRIMARY_TEXT_COLOR));
                                });
                            });
                        }
                        FileContent::Image(tex) => {
                            ui.vertical_centered(|ui| {
                                ui.add_space(80.0);
                                let a = ui.available_size() - Vec2::new(20.0, 20.0);
                                let handle = tex.clone();
                                ui.add(egui::Image::new(&handle).max_width(a.x).max_height(a.y));
                            });
                        }
                        
                        FileContent::Pdf(pdf_state) => {
                            let total = pdf_state.total_pages;
                            
                            if total > 0 {
                                ui.vertical_centered(|ui| {
                                    ui.add_space(34.0);
                                    ui.label(egui::RichText::new(format!("Page {} / {}", page + 1, total)).size(22.0).strong().color(SECONDARY_TEXT_COLOR));
                                    ui.add_space(20.0);
                                });

                                if ui.ui_contains_pointer() {
                                    let scroll_delta = ctx.input(|i| i.raw_scroll_delta.y);
                                    if scroll_delta.abs() > 0.1 {
                                        pdf_zoom_delta += scroll_delta * 0.005; 
                                    }
                                    let zoom_delta = ctx.input(|i| i.zoom_delta());
                                    if zoom_delta != 1.0 {
                                        pdf_zoom_delta += zoom_delta - 1.0;
                                    }
                                }

                                let current_zoom = self.app.pdf_zoom;
                                let tex_opt = pdf_state.get_page(ctx, page, current_zoom);

                                let mut scroll_style = (*ctx.style()).clone();
                                scroll_style.visuals.widgets.hovered.bg_fill = Color32::TRANSPARENT;
                                scroll_style.visuals.widgets.active.bg_fill = Color32::TRANSPARENT;
                                scroll_style.spacing.scroll.bar_width = 0.0;
                                scroll_style.spacing.scroll.handle_min_length = 0.0;
                                
                                egui::ScrollArea::both()
                                    .auto_shrink([false, false])
                                    .max_height(ui.available_height() - 100.0)
                                    .show(ui, |ui| {
                                    ui.set_style(scroll_style);
                                        
                                    if let Some(tex) = tex_opt {
                                        let display_height = (ctx.screen_rect().height() - 200.0) * current_zoom;
                                        let aspect = tex.size()[0] as f32 / tex.size()[1] as f32;
                                        let display_width = display_height * aspect;
                                        
                                        let w_avail = ui.available_width();
                                        ui.horizontal(|ui| {
                                            if display_width < w_avail {
                                                ui.add_space((w_avail - display_width) / 2.0);
                                            }
                                            ui.add(egui::Image::new(&tex).fit_to_exact_size(egui::vec2(display_width, display_height)));
                                        });
                                    } else {
                                        ui.vertical_centered(|ui| { 
                                            ui.add_space(ui.available_height() / 2.0 - 100.0);
                                            ui.spinner(); 
                                        });
                                    }
                                });

                                egui::Area::new(Id::new("pdf_nav"))
                                    .order(egui::Order::Foreground)
                                    .anchor(egui::Align2::CENTER_BOTTOM, [0.0, -24.0])
                                    .show(ctx, |ui| {
                                        ui.horizontal(|ui| {
                                            if page > 0 {
                                                if Self::icon_btn(ui, &cl_tex, 60.0, SECONDARY_BUTTON_BG, 10.0) { prev = true; }
                                            } else { ui.add_space(68.0); }
                                            ui.add_space(30.0);
                                            if page < total - 1 {
                                                if Self::icon_btn(ui, &cr_tex, 60.0, SECONDARY_BUTTON_BG, 10.0) { next = true; }
                                            }
                                        });
                                    });
                            }
                        }
                        
                        FileContent::Audio(state) => {
                            ui.vertical_centered(|ui| {
                                ui.add_space(ui.available_height() / 4.0);
                                ui.label(egui::RichText::new(&self.app.current_code).size(48.0).strong().color(PRIMARY_TEXT_COLOR));
                                ui.add_space(40.0);

                                let now = std::time::Instant::now();
                                if state.is_playing {
                                    let dt = now.duration_since(state.last_update);
                                    state.current_pos += std::time::Duration::from_secs_f32(dt.as_secs_f32() * state.playback_speed);
                                }
                                state.last_update = now;
                                
                                let dur_secs = state.duration.map(|d| d.as_secs_f32()).unwrap_or(0.0);
                                if dur_secs > 0.0 && state.current_pos.as_secs_f32() > dur_secs {
                                    state.current_pos = std::time::Duration::from_secs_f32(dur_secs);
                                    state.is_playing = false;
                                }
                                
                                let mut pos_secs = state.current_pos.as_secs_f32();

                                let fmt_time = |secs: f32| -> String {
                                    let s = secs as u32;
                                    format!("{:02}:{:02}", s / 60, s % 60)
                                };

                                ui.label(egui::RichText::new(format!("{} / {}", fmt_time(pos_secs), fmt_time(dur_secs)))
                                    .size(24.0).strong().color(PRIMARY_TEXT_COLOR));
                                ui.add_space(10.0);

                                ui.horizontal(|ui| {
                                    // Use ui.available_width() to perfectly center the 70% width slider
                                    let slider_w = ui.available_width() * 0.70;
                                    let padding = (ui.available_width() - slider_w) / 2.0;
                                    ui.add_space(padding);
                                    
                                    let mut slider_style = (*ctx.style()).clone();
                                    slider_style.visuals.widgets.inactive.bg_fill = SECONDARY_BUTTON_BG;
                                    slider_style.visuals.widgets.active.bg_fill = ACTION_BUTTON_COLOR;
                                    slider_style.visuals.widgets.hovered.bg_fill = ACTION_BUTTON_COLOR.linear_multiply(0.8);
                                    slider_style.visuals.selection.bg_fill = ACTION_BUTTON_COLOR;
                                    ui.set_style(slider_style);

                                    let slider = egui::Slider::new(&mut pos_secs, 0.0..=dur_secs)
                                        .show_value(false)
                                        .trailing_fill(true);
                                    
                                    let response = ui.add_sized([slider_w, 30.0], slider);
                                    if response.changed() {
                                        state.current_pos = std::time::Duration::from_secs_f32(pos_secs);
                                    }
                                    if response.drag_stopped() {
                                        if let Some(handle) = &audio_handle {
                                            let _ = state.seek(state.current_pos, handle);
                                        }
                                    }
                                });

                                ui.add_space(30.0);

                                // Control row perfectly centered
                                ui.horizontal(|ui| {
                                    // 4 buttons + 3 spaces of 10.0
                                    // Dropdown (80) + Rewind (70) + Play/Pause (90) + Forward (70) + spaces (30) = 340 total width
                                    let controls_w = 340.0;
                                    let padding = (ui.available_width() - controls_w) / 2.0;
                                    ui.add_space(padding);
                                    
                                    let mut btn_style = (*ctx.style()).clone();
                                    btn_style.visuals.widgets.inactive.bg_fill = ACTION_BUTTON_COLOR;
                                    btn_style.visuals.widgets.hovered.bg_fill = ACTION_BUTTON_COLOR.linear_multiply(0.8);
                                    btn_style.visuals.widgets.inactive.rounding = Rounding::same(16.0);
                                    ui.style_mut().visuals = btn_style.visuals;

                                    // Speed Dropdown
                                    let mut current_speed = state.playback_speed;
                                    egui::ComboBox::from_id_salt("audio_speed")
                                        .width(80.0)
                                        .selected_text(format!("{}x", current_speed))
                                        .show_ui(ui, |ui| {
                                            ui.selectable_value(&mut current_speed, 1.0, "1.0x");
                                            ui.selectable_value(&mut current_speed, 1.25, "1.25x");
                                            ui.selectable_value(&mut current_speed, 1.5, "1.5x");
                                            ui.selectable_value(&mut current_speed, 2.0, "2.0x");
                                        });
                                    if current_speed != state.playback_speed {
                                        state.playback_speed = current_speed;
                                        state.sink.set_speed(current_speed);
                                    }
                                    
                                    ui.add_space(10.0);

                                    // Rewind
                                    if ui.add_sized([70.0, 60.0], egui::Button::new(egui::RichText::new("⏪").size(24.0).color(Color32::WHITE))).clicked() {
                                        let target = (state.current_pos.as_secs_f32() - 10.0).max(0.0);
                                        let target_dur = std::time::Duration::from_secs_f32(target);
                                        if let Some(handle) = &audio_handle {
                                            let _ = state.seek(target_dur, handle);
                                        }
                                    }
                                    ui.add_space(10.0);

                                    // Play / Pause
                                    let icon = if state.is_playing { "⏸" } else { "▶" };
                                    let btn = egui::Button::new(egui::RichText::new(icon).size(36.0).color(Color32::WHITE));
                                    if ui.add_sized([90.0, 75.0], btn).clicked() {
                                        if state.is_playing {
                                            state.sink.pause();
                                            state.is_playing = false;
                                        } else {
                                            if dur_secs > 0.0 && state.current_pos.as_secs_f32() >= dur_secs - 0.5 {
                                                state.current_pos = std::time::Duration::ZERO;
                                                if let Some(handle) = &audio_handle {
                                                    let _ = state.seek(std::time::Duration::ZERO, handle);
                                                }
                                            }
                                            state.sink.play();
                                            state.is_playing = true;
                                            state.last_update = std::time::Instant::now();
                                        }
                                    }
                                    ui.add_space(10.0);

                                    // Forward
                                    if ui.add_sized([70.0, 60.0], egui::Button::new(egui::RichText::new("⏩").size(24.0).color(Color32::WHITE))).clicked() {
                                        let target = (state.current_pos.as_secs_f32() + 10.0).min(dur_secs);
                                        let target_dur = std::time::Duration::from_secs_f32(target);
                                        if let Some(handle) = &audio_handle {
                                            let _ = state.seek(target_dur, handle);
                                        }
                                    }
                                });
                            });
                        }
                        
                        FileContent::Video(child_arc) => {
                            ui.vertical_centered(|ui| {
                                ui.add_space(ui.available_height() / 4.0);
                                ui.label(egui::RichText::new(&self.app.current_code).size(48.0).strong().color(PRIMARY_TEXT_COLOR));
                                ui.add_space(20.0);
                                
                                // Cleaned up video player logic.
                                // Instead of making it look like a crash/error, we present it as a clean "Video is open in another app" control page.
                                ui.label(egui::RichText::new("External Video Player Active").size(24.0).color(SECONDARY_TEXT_COLOR));
                                ui.add_space(40.0);
                                
                                let mut is_running = false;
                                if let Ok(mut child) = child_arc.lock() {
                                    match child.try_wait() {
                                        Ok(Some(_)) => { is_running = false; }
                                        Ok(None) => { is_running = true; }
                                        Err(_) => { is_running = false; }
                                    }
                                }

                                if is_running {
                                    ui.label(egui::RichText::new("Return to your desktop to view the video.").size(18.0).color(SECONDARY_TEXT_COLOR));
                                    ui.add_space(30.0);

                                    // Stop button centered
                                    ui.horizontal(|ui| {
                                        let btn_w = 240.0;
                                        let padding = (ui.available_width() - btn_w) / 2.0;
                                        ui.add_space(padding);
                                        
                                        let mut style = (*ctx.style()).clone();
                                        style.visuals.widgets.inactive.bg_fill = Color32::from_rgb(250, 88, 88); 
                                        style.visuals.widgets.hovered.bg_fill = Color32::from_rgb(200, 60, 60);
                                        style.visuals.widgets.inactive.rounding = Rounding::same(16.0);
                                        ui.style_mut().visuals = style.visuals;

                                        let btn = egui::Button::new(egui::RichText::new("⏹ Close Video").size(24.0).color(Color32::WHITE));
                                        if ui.add_sized([btn_w, 75.0], btn).clicked() {
                                            if let Ok(mut child) = child_arc.lock() {
                                                let _ = child.kill();
                                                let _ = child.wait();
                                            }
                                        }
                                    });
                                } else {
                                    ui.label(egui::RichText::new("The video has finished playing.").size(18.0).color(SECONDARY_TEXT_COLOR));
                                }
                            });
                        }

                        FileContent::Html(h) => {
                            ui.vertical_centered(|ui| {
                                egui::ScrollArea::vertical().show(ui, |ui| {
                                    ui.add_space(100.0);
                                    ui.label(egui::RichText::new(h.as_str()).size(16.0).color(PRIMARY_TEXT_COLOR));
                                });
                            });
                        }
                    }
                }

                if pdf_zoom_delta != 0.0 {
                    self.app.pdf_zoom = (self.app.pdf_zoom + pdf_zoom_delta).clamp(0.5, 12.0);
                }

                if prev { self.app.pdf_page -= 1; }
                if next { self.app.pdf_page += 1; }
            }
        });
    }

    fn render_popups(&self, ctx: &egui::Context) {
        let now = std::time::SystemTime::now();
        let err_tex = self.app.icons.error.clone();
        let ok_tex  = self.app.icons.success.clone();

        for (i, popup) in self.app.popups.iter().enumerate() {
            let elapsed = now.duration_since(popup.created_at).unwrap_or_default().as_secs_f32();
            let anim = if elapsed < 0.25 { elapsed / 0.25 }
                       else if elapsed > 3.0 { (3.5 - elapsed) / 0.5 }
                       else { 1.0 }.clamp(0.0, 1.0);
            if anim <= 0.0 { continue; }

            let y = 24.0 + i as f32 * 100.0 - 20.0 * (1.0 - anim);
            let bg = match popup.popup_type {
                PopupType::Error   => Color32::from_rgb(250, 88, 88),
                PopupType::Success => Color32::from_rgb(69, 196, 91),
            };
            let tex = match popup.popup_type {
                PopupType::Error   => &err_tex,
                PopupType::Success => &ok_tex,
            };

            egui::Area::new(Id::new("popup").with(popup.id))
                .order(egui::Order::Tooltip)
                .anchor(egui::Align2::CENTER_TOP, [0.0, y])
                .show(ctx, |ui| {
                    ui.multiply_opacity(anim);
                    egui::Frame::none()
                        .fill(bg)
                        .rounding(Rounding::same(12.0))
                        .inner_margin(Margin::same(20.0))
                        .show(ui, |ui| {
                            ui.horizontal(|ui| {
                                let icon_rect = ui.allocate_exact_size(Vec2::splat(36.0), Sense::hover()).0;
                                ui.painter().image(
                                    tex.id(), icon_rect,
                                    egui::Rect::from_min_max(Pos2::ZERO, Pos2::new(1.0, 1.0)),
                                    Color32::WHITE,
                                );
                                ui.add_space(12.0);
                                ui.vertical(|ui| {
                                    let title = match popup.popup_type {
                                        PopupType::Error   => "Error",
                                        PopupType::Success => "Success",
                                    };
                                    ui.label(egui::RichText::new(title).size(18.0).strong().color(Color32::WHITE));
                                    ui.label(egui::RichText::new(&popup.message).size(14.0).color(Color32::WHITE));
                                });
                            });
                        });
                });
        }
    }
}