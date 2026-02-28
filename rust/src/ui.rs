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
        // Global style: no grey button backgrounds anywhere
        let mut style = (*ctx.style()).clone();
        style.visuals.window_fill = BACKGROUND_COLOR;
        style.visuals.panel_fill = BACKGROUND_COLOR;
        style.visuals.override_text_color = Some(PRIMARY_TEXT_COLOR);
        style.visuals.widgets.noninteractive.bg_fill = BACKGROUND_COLOR;
        // Make all default buttons transparent / borderless
        style.visuals.widgets.inactive.bg_fill = Color32::TRANSPARENT;
        style.visuals.widgets.inactive.bg_stroke = Stroke::NONE;
        style.visuals.widgets.hovered.bg_fill = Color32::from_black_alpha(15);
        style.visuals.widgets.hovered.bg_stroke = Stroke::NONE;
        style.visuals.widgets.active.bg_fill = Color32::from_black_alpha(30);
        style.visuals.widgets.active.bg_stroke = Stroke::NONE;
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

        // Options drawn last = highest z-order
        let opt_anim = ctx.animate_bool_with_time(Id::new("opt_anim"), self.app.show_options, 0.25);
        if opt_anim > 0.0 { self.render_options(ctx, opt_anim); }

        self.render_popups(ctx);
    }

    // ─── Helper: draw an icon image button, returns true if clicked ───────────
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

    // ─── Grid ─────────────────────────────────────────────────────────────────
    fn render_grid(&mut self, ctx: &egui::Context) {
        let scan_text = self.app.translations.get("scan", self.app.language).to_string();
        let menu_tex = self.app.icons.menu.clone();

        egui::CentralPanel::default().show(ctx, |ui| {
            // Hamburger button – always above everything
            egui::Area::new(Id::new("options_btn_area"))
                .order(egui::Order::Foreground)
                .anchor(egui::Align2::RIGHT_TOP, [-50.0, 50.0])
                .show(ctx, |ui| {
                    if Self::icon_btn(ui, &menu_tex, 60.0, Color32::TRANSPARENT, 12.0) {
                        self.app.show_options = true;
                    }
                });

            // Perfectly centred grid
            let grid_w = 5.0 * 100.0 + 4.0 * 30.0; // 620
            let grid_h = 5.0 * 100.0 + 4.0 * 30.0 + 40.0 + 73.0; // 733
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

                                    // Inactive = solid BUTTON_COLOR, Active = transparent bg + border
                                    // Use BACKGROUND_COLOR for active fill so it matches the panel
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

                    // Scan button
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

    // ─── Tutorial ─────────────────────────────────────────────────────────────
    fn render_tutorial(&mut self, ctx: &egui::Context, anim: f32) {
        let welcome = self.app.translations.get("welcome", self.app.language).to_string();
        let tutorial = self.app.translations.get("tutorial", self.app.language).to_string();
        let skip    = self.app.translations.get("skip",     self.app.language).to_string();
        let next    = self.app.translations.get("next",     self.app.language).to_string();

        // Dim background but leave content visible
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

    // ─── Options popup (original style, bigger) ───────────────────────────────
    fn render_options(&mut self, ctx: &egui::Context, anim: f32) {
        let history_str  = self.app.translations.get("history",  self.app.language).to_string();
        let help_str     = self.app.translations.get("help",     self.app.language).to_string();
        let lang_str     = self.app.translations.get("language", self.app.language).to_string();

        let hist_tex = self.app.icons.history.clone();
        let help_tex = self.app.icons.help.clone();
        let lang_tex = self.app.icons.language.clone();

        // Backdrop — click outside closes
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

        // Popup card top-right, slides down from top
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

    // ─── History ──────────────────────────────────────────────────────────────
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
                                    // Convert stored UTC to Local for display
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

    // ─── Explanation ──────────────────────────────────────────────────────────
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

    // ─── Results ──────────────────────────────────────────────────────────────
    fn render_results(&mut self, ctx: &egui::Context) {
        let back_tex = self.app.icons.back.clone();
        let info_tex = self.app.icons.info.clone();
        let cl_tex   = self.app.icons.chevron_left.clone();
        let cr_tex   = self.app.icons.chevron_right.clone();

        egui::CentralPanel::default().show(ctx, |ui| {
            
            // --- TOP NAVIGATION ---
            egui::Area::new(Id::new("back_area"))
                .order(egui::Order::Foreground)
                .anchor(egui::Align2::LEFT_TOP, [34.0, 34.0])
                .show(ctx, |ui| {
                    if Self::icon_btn(ui, &back_tex, 56.0, SECONDARY_BUTTON_BG, 12.0) {
                        use crate::file_handler::FileContent;
                        // Cleanly stop any running media when going back
                        if let Some(FileContent::Video(child_arc)) = &self.app.current_file {
                            if let Ok(mut child) = child_arc.lock() {
                                let _ = child.kill();
                                let _ = child.wait();
                            }
                        } else if let Some(FileContent::Audio { sink, .. }) = &self.app.current_file {
                            sink.stop();
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
                        self.app.show_explanation = true;
                    }
                });

            // --- MAIN VIEW PORT ---
            ui.vertical_centered(|ui| {
                if self.app.is_loading {
                    ui.add_space(ui.available_height() / 2.0);
                    ui.spinner();
                } else {
                    let page = self.app.pdf_page;
                    let mut prev = false;
                    let mut next = false;

                    // Take mutable reference to handle audio Play/Pause state correctly
                    if let Some(content) = &mut self.app.current_file {
                        use crate::file_handler::FileContent;
                        match content {
                            FileContent::Text(t) => {
                                egui::ScrollArea::vertical().show(ui, |ui| {
                                    ui.add_space(100.0);
                                    ui.label(egui::RichText::new(t.as_str()).size(20.0).color(PRIMARY_TEXT_COLOR));
                                });
                            }
                            FileContent::Image(tex) => {
                                ui.add_space(80.0);
                                let a = ui.available_size() - Vec2::new(20.0, 20.0);
                                // FIX: pass a cloned handle which derefs correctly
                                let handle = tex.clone();
                                ui.add(egui::Image::new(&handle).max_width(a.x).max_height(a.y));
                            }
                            
                            // ---- FULL PDF VIEWER ----
                            FileContent::Pdf { pages, .. } => {
                                if !pages.is_empty() {
                                    // Toolbar
                                    ui.add_space(34.0);
                                    ui.horizontal(|ui| {
                                        ui.add_space(120.0); // Offset for back button
                                        ui.label(egui::RichText::new(format!("Page {} / {}", page + 1, pages.len())).size(22.0).strong().color(SECONDARY_TEXT_COLOR));
                                        
                                        ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                                            ui.add_space(120.0); // Offset for info button
                                            
                                            // Zoom Buttons
                                            let mut style = (*ctx.style()).clone();
                                            style.visuals.widgets.inactive.bg_fill = SECONDARY_BUTTON_BG;
                                            style.visuals.widgets.hovered.bg_fill = SECONDARY_BUTTON_BG.linear_multiply(0.8);
                                            style.visuals.widgets.inactive.rounding = Rounding::same(8.0);
                                            ui.style_mut().visuals = style.visuals;

                                            if ui.add_sized([44.0, 44.0], egui::Button::new(egui::RichText::new("➕").size(24.0))).clicked() {
                                                self.app.pdf_zoom = (self.app.pdf_zoom + 0.25).min(3.0);
                                            }
                                            ui.add_space(10.0);
                                            if ui.add_sized([44.0, 44.0], egui::Button::new(egui::RichText::new("➖").size(24.0))).clicked() {
                                                self.app.pdf_zoom = (self.app.pdf_zoom - 0.25).max(0.5);
                                            }
                                        });
                                    });

                                    ui.add_space(20.0);

                                    // Scrollable Canvas
                                    egui::ScrollArea::both()
                                        .auto_shrink([false, false])
                                        .max_height(ui.available_height() - 100.0) // Leave space for nav
                                        .show(ui, |ui| {
                                        if let Some(tex) = pages.get(page) {
                                            let aspect = tex.size()[0] as f32 / tex.size()[1] as f32;
                                            // Default scale fills screen vertically minus margins. Then multiply by zoom factor.
                                            let display_height = (ctx.screen_rect().height() - 200.0) * self.app.pdf_zoom;
                                            let display_width = display_height * aspect;
                                            
                                            // FIX: pass a cloned handle
                                            let handle = tex.clone();
                                            ui.add(egui::Image::new(&handle).fit_to_exact_size(egui::vec2(display_width, display_height)));
                                        }
                                    });

                                    // Bottom Navigation Area
                                    egui::Area::new(Id::new("pdf_nav"))
                                        .order(egui::Order::Foreground)
                                        .anchor(egui::Align2::CENTER_BOTTOM, [0.0, -24.0])
                                        .show(ctx, |ui| {
                                            ui.horizontal(|ui| {
                                                if page > 0 {
                                                    if Self::icon_btn(ui, &cl_tex, 60.0, SECONDARY_BUTTON_BG, 10.0) { prev = true; }
                                                } else { ui.add_space(68.0); }
                                                ui.add_space(30.0);
                                                if page < pages.len() - 1 {
                                                    if Self::icon_btn(ui, &cr_tex, 60.0, SECONDARY_BUTTON_BG, 10.0) { next = true; }
                                                }
                                            });
                                        });
                                }
                            }
                            
                            // ---- FULL AUDIO PLAYER ----
                            FileContent::Audio { sink, is_playing } => {
                                ui.add_space(ui.available_height() / 3.0);
                                ui.label(egui::RichText::new("🎵 Playing Audio").size(40.0).strong().color(PRIMARY_TEXT_COLOR));
                                ui.add_space(10.0);
                                ui.label(egui::RichText::new(format!("Project: {}", self.app.current_code)).size(20.0).color(SECONDARY_TEXT_COLOR));
                                ui.add_space(50.0);

                                ui.horizontal(|ui| {
                                    ui.add_space(ui.available_width() / 2.0 - 100.0); // center
                                    
                                    let mut style = (*ctx.style()).clone();
                                    style.visuals.widgets.inactive.bg_fill = ACTION_BUTTON_COLOR;
                                    style.visuals.widgets.hovered.bg_fill = ACTION_BUTTON_COLOR.linear_multiply(0.8);
                                    style.visuals.widgets.inactive.rounding = Rounding::same(16.0);
                                    ui.style_mut().visuals = style.visuals;

                                    let icon = if *is_playing { "⏸ Pause" } else { "▶ Play" };
                                    let btn = egui::Button::new(egui::RichText::new(icon).size(30.0).color(Color32::WHITE));
                                    
                                    if ui.add_sized([200.0, 75.0], btn).clicked() {
                                        if *is_playing {
                                            sink.pause();
                                            *is_playing = false;
                                        } else {
                                            sink.play();
                                            *is_playing = true;
                                        }
                                    }
                                });
                            }
                            
                            // ---- FULL VIDEO MANAGEMENT ----
                            FileContent::Video(child_arc) => {
                                ui.add_space(ui.available_height() / 3.0);
                                ui.label(egui::RichText::new("🎬 Video Playing in External Window").size(32.0).strong().color(PRIMARY_TEXT_COLOR));
                                ui.add_space(40.0);

                                ui.horizontal(|ui| {
                                    ui.add_space(ui.available_width() / 2.0 - 120.0);
                                    
                                    let mut style = (*ctx.style()).clone();
                                    style.visuals.widgets.inactive.bg_fill = Color32::from_rgb(250, 88, 88); // RED
                                    style.visuals.widgets.hovered.bg_fill = Color32::from_rgb(200, 60, 60);
                                    style.visuals.widgets.inactive.rounding = Rounding::same(16.0);
                                    ui.style_mut().visuals = style.visuals;

                                    let btn = egui::Button::new(egui::RichText::new("⏹ Stop Video").size(30.0).color(Color32::WHITE));
                                    if ui.add_sized([240.0, 75.0], btn).clicked() {
                                        if let Ok(mut child) = child_arc.lock() {
                                            let _ = child.kill();
                                            let _ = child.wait(); // prevent zombie process
                                        }
                                        // Auto-close results view when video is stopped
                                        self.app.show_results = false;
                                    }
                                });
                            }

                            FileContent::Html(h) => {
                                egui::ScrollArea::vertical().show(ui, |ui| {
                                    ui.add_space(100.0);
                                    ui.label(egui::RichText::new(h.as_str()).size(16.0).color(PRIMARY_TEXT_COLOR));
                                });
                            }
                        }
                    }
                    if prev { self.app.pdf_page -= 1; }
                    if next { self.app.pdf_page += 1; }
                }
            });
        });
    }

    // ─── Popups ───────────────────────────────────────────────────────────────
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