use eframe::egui::{self, Color32, Pos2, Rect, Sense, Vec2, Rounding, Stroke, Margin, Id};
use crate::app::{CubeApp, PopupType};

// CSS Var equivalents
const BACKGROUND_COLOR: Color32 = Color32::from_rgb(236, 230, 240); // #ECE6F0
const ACTION_BUTTON_COLOR: Color32 = Color32::from_rgb(101, 85, 143); // #65558F
const BUTTON_COLOR: Color32 = Color32::from_rgb(29, 27, 32); // #1D1B20
const PRIMARY_TEXT_COLOR: Color32 = Color32::from_rgb(29, 27, 32); // #1D1B20
const SECONDARY_TEXT_COLOR: Color32 = Color32::from_rgb(73, 69, 79); // #49454F
const SECONDARY_BUTTON_BG: Color32 = Color32::from_rgb(218, 207, 216); // #DACFD8

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
        
        ctx.set_style(style);

        // Render base layer
        if self.app.show_results {
            self.render_results(ctx);
        } else {
            self.render_grid(ctx);
        }

        // Render animated overlays (they manage their own opacities based on time)
        let tut_anim = ctx.animate_bool_with_time(Id::new("tut_anim"), self.app.show_tutorial, 0.3);
        if tut_anim > 0.0 {
            self.render_tutorial(ctx, tut_anim);
        }

        let opt_anim = ctx.animate_bool_with_time(Id::new("opt_anim"), self.app.show_options, 0.3);
        if opt_anim > 0.0 {
            self.render_options(ctx, opt_anim);
        }

        let hist_anim = ctx.animate_bool_with_time(Id::new("hist_anim"), self.app.show_history, 0.3);
        if hist_anim > 0.0 {
            self.render_history(ctx, hist_anim);
        }

        let exp_anim = ctx.animate_bool_with_time(Id::new("exp_anim"), self.app.show_explanation, 0.3);
        if exp_anim > 0.0 {
            self.render_explanation(ctx, exp_anim);
        }

        self.render_popups(ctx);
    }

    fn render_grid(&mut self, ctx: &egui::Context) {
        let scan_text = self.app.translations.get("scan", self.app.language).to_string();

        egui::CentralPanel::default().show(ctx, |ui| {
            // Options Hamburger Button (top right)
            egui::Area::new(Id::new("options_btn_area"))
                .order(egui::Order::Background)
                .anchor(egui::Align2::RIGHT_TOP, [-50.0, 50.0])
                .show(ctx, |ui| {
                    let btn = egui::Button::new(egui::RichText::new("☰").size(30.0).color(BUTTON_COLOR))
                        .frame(false);
                    if ui.add_sized([43.0, 43.0], btn).clicked() {
                        self.app.show_options = true;
                    }
                });

            ui.vertical_centered(|ui| {
                // Exact centering logic based on 100px cells and 30px gaps
                let grid_width = 5.0 * 100.0 + 4.0 * 30.0; // 620
                let grid_height = 5.0 * 100.0 + 4.0 * 30.0 + 40.0 + 73.0; // 733
                let avail = ui.available_size();
                let x_pad = (avail.x - grid_width).max(0.0) / 2.0;
                let y_pad = (avail.y - grid_height).max(0.0) / 2.0;
                
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
                                        let anim_id = Id::new("cell_anim").with(row).with(col);
                                        let active_anim = ctx.animate_bool_with_time(anim_id, is_active, 0.3);

                                        let (rect, response) = ui.allocate_exact_size(
                                            Vec2::splat(100.0),
                                            Sense::click(),
                                        );

                                        if response.clicked() {
                                            self.app.handle_cell_click(row, col);
                                        }

                                        // Hover animation
                                        let hover_scale = if response.hovered() { 1.05 } else { 1.0 };
                                        let hover_anim = ctx.animate_value_with_time(Id::new("hover").with(row).with(col), hover_scale, 0.2);
                                        
                                        let scaled_rect = Rect::from_center_size(rect.center(), rect.size() * hover_anim);

                                        // Morph from inactive (solid bg) to active (border, no bg)
                                        let bg_alpha = (255.0 * (1.0 - active_anim)) as u8;
                                        let bg_color = Color32::from_rgba_premultiplied(
                                            BUTTON_COLOR.r(), BUTTON_COLOR.g(), BUTTON_COLOR.b(), bg_alpha
                                        );

                                        let stroke_width = 5.0 * active_anim;
                                        let stroke_color = Color32::from_rgba_premultiplied(
                                            BUTTON_COLOR.r(), BUTTON_COLOR.g(), BUTTON_COLOR.b(), (255.0 * active_anim) as u8
                                        );

                                        ui.painter().rect(
                                            scaled_rect,
                                            Rounding::same(10.0),
                                            bg_color,
                                            Stroke::new(stroke_width, stroke_color),
                                        );
                                    }
                                    ui.end_row();
                                }
                            });

                        ui.add_space(40.0);

                        ui.horizontal(|ui| {
                            ui.add_space((grid_width - 456.0) / 2.0); // Center the scan button under the grid
                            
                            let (rect, response) = ui.allocate_exact_size(Vec2::new(456.0, 73.0), Sense::click());
                            if response.clicked() {
                                self.app.scan_code(ctx);
                            }

                            let hover_scale = if response.hovered() { 1.02 } else { 1.0 };
                            let hover_anim = ctx.animate_value_with_time(Id::new("scan_hover"), hover_scale, 0.2);
                            let scaled_rect = Rect::from_center_size(rect.center(), rect.size() * hover_anim);

                            ui.painter().rect_stroke(
                                scaled_rect,
                                Rounding::same(10.0),
                                Stroke::new(5.0, BUTTON_COLOR),
                            );

                            ui.painter().text(
                                scaled_rect.center(),
                                egui::Align2::CENTER_CENTER,
                                scan_text.clone(),
                                egui::FontId::proportional(24.0 * hover_anim),
                                BUTTON_COLOR,
                            );
                        });
                    });
                });
            });
        });
    }

    fn render_tutorial(&mut self, ctx: &egui::Context, anim: f32) {
        let welcome = self.app.translations.get("welcome", self.app.language).to_string();
        let tutorial = self.app.translations.get("tutorial", self.app.language).to_string();
        let skip = self.app.translations.get("skip", self.app.language).to_string();
        let next = self.app.translations.get("next", self.app.language).to_string();

        egui::Area::new(Id::new("tutorial_bg"))
            .order(egui::Order::Foreground)
            .fixed_pos(Pos2::ZERO)
            .show(ctx, |ui| {
                ui.painter().rect_filled(ctx.screen_rect(), 0.0, Color32::from_black_alpha((50.0 * anim) as u8));
            });

        // Slide in from top
        egui::Area::new(Id::new("tutorial_content"))
            .order(egui::Order::Foreground)
            .anchor(egui::Align2::CENTER_CENTER, [0.0, 20.0 * (1.0 - anim)])
            .show(ctx, |ui| {
                ui.multiply_opacity(anim);
                
                egui::Frame::none()
                    .fill(BACKGROUND_COLOR)
                    .rounding(Rounding::same(30.0))
                    .inner_margin(Margin::same(24.0))
                    .show(ui, |ui| {
                        ui.set_width(312.0);
                        
                        ui.vertical(|ui| {
                            ui.label(egui::RichText::new(welcome).size(24.0).color(PRIMARY_TEXT_COLOR).strong());
                            ui.add_space(6.0);
                            ui.label(egui::RichText::new(tutorial).size(16.0).color(PRIMARY_TEXT_COLOR));
                            ui.add_space(20.0);
                            
                            ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                                let btn = egui::Button::new(egui::RichText::new(next).color(ACTION_BUTTON_COLOR)).frame(false);
                                if ui.add(btn).clicked() { self.app.show_tutorial = false; }
                                
                                ui.add_space(10.0);
                                
                                let btn2 = egui::Button::new(egui::RichText::new(skip).color(ACTION_BUTTON_COLOR)).frame(false);
                                if ui.add(btn2).clicked() { self.app.show_tutorial = false; }
                            });
                        });
                    });
            });
    }

    fn render_options(&mut self, ctx: &egui::Context, anim: f32) {
        egui::Area::new(Id::new("options_bg_area"))
            .order(egui::Order::Foreground)
            .fixed_pos(Pos2::ZERO)
            .show(ctx, |ui| {
                let response = ui.allocate_response(ctx.screen_rect().size(), Sense::click());
                if response.clicked() { self.app.show_options = false; } // Close on click outside
                ui.painter().rect_filled(ctx.screen_rect(), 0.0, Color32::from_black_alpha((50.0 * anim) as u8));
            });

        // Slide in from right
        let offset_x = (1.0 - anim) * 200.0;
        egui::Area::new(Id::new("options_popup_area"))
            .order(egui::Order::Foreground)
            .anchor(egui::Align2::RIGHT_TOP, [-34.0 + offset_x, 34.0])
            .show(ctx, |ui| {
                ui.multiply_opacity(anim);
                
                egui::Frame::none()
                    .fill(BACKGROUND_COLOR)
                    .rounding(Rounding::same(10.0))
                    .inner_margin(Margin::same(24.0))
                    .show(ui, |ui| {
                        // Prevent clicks inside popup from bleeding to background
                        ui.interact(ui.max_rect(), Id::new("opt_block"), Sense::click());
                        
                        ui.vertical(|ui| {
                            let history_str = self.app.translations.get("history", self.app.language).to_string();
                            let help_str = self.app.translations.get("help", self.app.language).to_string();
                            let lang_str = self.app.translations.get("language", self.app.language).to_string();

                            let btn_style = |text: String| {
                                egui::Button::new(egui::RichText::new(text).strong().size(15.0).color(PRIMARY_TEXT_COLOR))
                                    .frame(false)
                            };

                            if ui.add(btn_style(format!("📜 {}", history_str))).clicked() {
                                self.app.show_history = true;
                                self.app.show_options = false;
                            }
                            ui.add_space(20.0);
                            if ui.add(btn_style(format!("❓ {}", help_str))).clicked() {
                                self.app.show_tutorial = true;
                                self.app.show_options = false;
                            }
                            ui.add_space(20.0);
                            if ui.add(btn_style(format!("🌐 {}", lang_str))).clicked() {
                                use crate::translations::Language;
                                self.app.language = match self.app.language {
                                    Language::English => Language::Italian,
                                    Language::Italian => Language::English,
                                };
                            }
                        });
                    });
            });
    }

    fn render_history(&mut self, ctx: &egui::Context, anim: f32) {
        egui::Area::new(Id::new("history_bg_area"))
            .order(egui::Order::Foreground)
            .fixed_pos(Pos2::ZERO)
            .show(ctx, |ui| {
                let response = ui.allocate_response(ctx.screen_rect().size(), Sense::click());
                if response.clicked() { self.app.show_history = false; }
                ui.painter().rect_filled(ctx.screen_rect(), 0.0, Color32::from_black_alpha((50.0 * anim) as u8));
            });

        let mut project_to_open = None;

        egui::Area::new(Id::new("history_popup_area"))
            .order(egui::Order::Foreground)
            .anchor(egui::Align2::CENTER_CENTER, [0.0, 20.0 * (1.0 - anim)])
            .show(ctx, |ui| {
                ui.multiply_opacity(anim);
                
                egui::Frame::none()
                    .fill(BACKGROUND_COLOR)
                    .rounding(Rounding::same(15.0))
                    .inner_margin(Margin::same(30.0))
                    .show(ui, |ui| {
                        ui.interact(ui.max_rect(), Id::new("hist_block"), Sense::click());
                        ui.set_width(340.0);

                        let title = self.app.translations.get("history", self.app.language).to_string();
                        ui.heading(egui::RichText::new(title).size(24.0).color(PRIMARY_TEXT_COLOR));
                        ui.add_space(10.0);

                        egui::ScrollArea::vertical().max_height(300.0).show(ui, |ui| {
                            let items = self.app.history.get_items();
                            if items.is_empty() {
                                ui.label(self.app.translations.get("historyEmpty", self.app.language));
                            } else {
                                for item in items {
                                    ui.horizontal(|ui| {
                                        let btn = egui::Button::new(egui::RichText::new(&item.code).strong().color(PRIMARY_TEXT_COLOR)).frame(false);
                                        if ui.add(btn).clicked() {
                                            project_to_open = Some(item.code.clone());
                                        }
                                        ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                                            ui.label(egui::RichText::new(item.timestamp.format("%H:%M:%S").to_string()).size(12.0).color(SECONDARY_TEXT_COLOR));
                                        });
                                    });
                                    ui.painter().line_segment(
                                        [ui.cursor().min, Pos2::new(ui.cursor().max.x, ui.cursor().min.y)],
                                        Stroke::new(0.5, Color32::from_rgb(169, 169, 169))
                                    );
                                    ui.add_space(5.0);
                                }
                            }
                        });

                        ui.add_space(20.0);
                        
                        let close_str = self.app.translations.get("close", self.app.language).to_string();
                        let btn = egui::Button::new(egui::RichText::new(close_str).color(Color32::WHITE).size(16.0))
                            .fill(ACTION_BUTTON_COLOR).rounding(Rounding::same(5.0));
                            
                        if ui.add(btn).clicked() {
                            self.app.show_history = false;
                        }
                    });
            });

        if let Some(code) = project_to_open {
            self.app.open_history_project(ctx, code);
        }
    }

    fn render_explanation(&mut self, ctx: &egui::Context, anim: f32) {
        egui::Area::new(Id::new("exp_bg_area"))
            .order(egui::Order::Foreground)
            .fixed_pos(Pos2::ZERO)
            .show(ctx, |ui| {
                let response = ui.allocate_response(ctx.screen_rect().size(), Sense::click());
                if response.clicked() { self.app.show_explanation = false; }
                ui.painter().rect_filled(ctx.screen_rect(), 0.0, Color32::from_black_alpha((128.0 * anim) as u8));
            });

        egui::Area::new(Id::new("exp_popup_area"))
            .order(egui::Order::Foreground)
            .anchor(egui::Align2::CENTER_CENTER, [0.0, 20.0 * (1.0 - anim)])
            .show(ctx, |ui| {
                ui.multiply_opacity(anim);
                
                egui::Frame::none()
                    .fill(BACKGROUND_COLOR)
                    .rounding(Rounding::same(10.0))
                    .inner_margin(Margin::same(20.0))
                    .show(ui, |ui| {
                        ui.interact(ui.max_rect(), Id::new("exp_block"), Sense::click());
                        ui.set_max_width(ctx.screen_rect().width() * 0.5);
                        ui.set_max_height(ctx.screen_rect().height() * 0.8);

                        let category = self.app.get_category(&self.app.current_code).to_string();
                        let title = format!("{}: {}", category, self.app.current_code);
                        ui.heading(egui::RichText::new(title).size(24.0).color(PRIMARY_TEXT_COLOR));
                        ui.add_space(10.0);

                        egui::ScrollArea::vertical().show(ui, |ui| {
                            ui.label(egui::RichText::new(&self.app.explanation_content).size(16.0).color(PRIMARY_TEXT_COLOR));
                        });

                        ui.add_space(20.0);
                        
                        let close_str = self.app.translations.get("close", self.app.language).to_string();
                        let btn = egui::Button::new(egui::RichText::new(close_str).color(Color32::WHITE).size(16.0))
                            .fill(ACTION_BUTTON_COLOR).rounding(Rounding::same(5.0));
                            
                        if ui.add(btn).clicked() {
                            self.app.show_explanation = false;
                        }
                    });
            });
    }

    fn render_results(&mut self, ctx: &egui::Context) {
        let code = self.app.current_code.clone();
        
        egui::CentralPanel::default().show(ctx, |ui| {
            // BACK BUTTON
            egui::Area::new(Id::new("back_button_area"))
                .order(egui::Order::Foreground)
                .anchor(egui::Align2::LEFT_TOP, [34.0, 34.0])
                .show(ctx, |ui| {
                    let btn = egui::Button::new(egui::RichText::new("←").size(24.0).color(PRIMARY_TEXT_COLOR))
                        .fill(SECONDARY_BUTTON_BG).rounding(Rounding::same(10.0));
                    if ui.add_sized([43.0, 43.0], btn).clicked() {
                        self.app.show_results = false;
                        self.app.current_file = None;
                        self.app.pdf_page = 0;
                    }
                });

            // INFO BUTTON
            egui::Area::new(Id::new("info_button_area"))
                .order(egui::Order::Foreground)
                .anchor(egui::Align2::RIGHT_TOP, [-34.0, 34.0])
                .show(ctx, |ui| {
                    let btn = egui::Button::new(egui::RichText::new("ℹ").size(24.0).color(PRIMARY_TEXT_COLOR))
                        .fill(SECONDARY_BUTTON_BG).rounding(Rounding::same(10.0));
                    if ui.add_sized([43.0, 43.0], btn).clicked() {
                        self.app.show_explanation = true;
                    }
                });

            ui.vertical_centered(|ui| {
                if self.app.is_loading {
                    ui.add_space(ui.available_height() / 2.0);
                    ui.spinner();
                } else {
                    let page = self.app.pdf_page;
                    let mut prev_clicked = false;
                    let mut next_clicked = false;
                    
                    if let Some(content) = &self.app.current_file {
                        use crate::file_handler::FileContent;

                        match content {
                            FileContent::Text(text) => {
                                egui::ScrollArea::vertical().show(ui, |ui| {
                                    ui.add_space(100.0);
                                    ui.label(egui::RichText::new(text).size(20.0).color(PRIMARY_TEXT_COLOR));
                                });
                            }
                            FileContent::Image(texture) => {
                                ui.add_space(80.0);
                                let avail = ui.available_size() - egui::vec2(20.0, 20.0);
                                ui.add(
                                    egui::Image::new(texture)
                                        .max_width(avail.x)
                                        .max_height(avail.y)
                                );
                            }
                            FileContent::Pdf { pages, .. } => {
                                if !pages.is_empty() {
                                    ui.add_space(80.0);
                                    if let Some(texture) = pages.get(page) {
                                        let avail = ui.available_size() - egui::vec2(0.0, 120.0); 
                                        ui.add(egui::Image::new(texture).max_width(avail.x).max_height(avail.y));
                                    }

                                    egui::Area::new(Id::new("pdf_nav_area"))
                                        .order(egui::Order::Foreground)
                                        .anchor(egui::Align2::CENTER_BOTTOM, [0.0, -24.0])
                                        .show(ctx, |ui| {
                                            ui.horizontal(|ui| {
                                                if page > 0 {
                                                    let btn = egui::Button::new(egui::RichText::new("←").size(24.0).color(Color32::BLACK)).fill(SECONDARY_BUTTON_BG).rounding(Rounding::same(10.0));
                                                    if ui.add_sized([60.0, 60.0], btn).clicked() { prev_clicked = true; }
                                                } else { ui.add_space(68.0); }

                                                ui.add_space(30.0);

                                                if page < pages.len() - 1 {
                                                    let btn = egui::Button::new(egui::RichText::new("→").size(24.0).color(Color32::BLACK)).fill(SECONDARY_BUTTON_BG).rounding(Rounding::same(10.0));
                                                    if ui.add_sized([60.0, 60.0], btn).clicked() { next_clicked = true; }
                                                }
                                            });
                                        });
                                }
                            }
                            FileContent::Audio(_) => {
                                ui.add_space(ui.available_height() / 2.0);
                                ui.heading(egui::RichText::new("🎵 Audio playing...").color(PRIMARY_TEXT_COLOR));
                            }
                            FileContent::Video => {
                                ui.add_space(ui.available_height() / 2.0);
                                ui.heading(egui::RichText::new("🎬 Video Player opened").color(PRIMARY_TEXT_COLOR));
                            }
                            FileContent::Html(html) => {
                                egui::ScrollArea::vertical().show(ui, |ui| {
                                    ui.add_space(100.0);
                                    ui.label(egui::RichText::new(html).size(16.0).color(PRIMARY_TEXT_COLOR));
                                });
                            }
                        }
                    }
                    if prev_clicked { self.app.pdf_page -= 1; }
                    if next_clicked { self.app.pdf_page += 1; }
                }
            });
        });
    }

    fn render_popups(&self, ctx: &egui::Context) {
        let now = std::time::SystemTime::now();
        for (i, popup) in self.app.popups.iter().enumerate() {
            let elapsed = now.duration_since(popup.created_at).unwrap_or_default().as_secs_f32();
            
            let mut anim = 1.0;
            if elapsed < 0.3 { anim = elapsed / 0.3; }
            else if elapsed > 2.7 { anim = (3.0 - elapsed) / 0.3; }
            
            let anim = anim.clamp(0.0, 1.0);
            if anim <= 0.0 { continue; }

            let y_offset = 20.0 + (i as f32 * 100.0) - (20.0 * (1.0 - anim));
            
            let bg_color = match popup.popup_type {
                PopupType::Error => Color32::from_rgb(250, 88, 88),
                PopupType::Success => Color32::from_rgb(69, 196, 91),
            };

            egui::Area::new(Id::new("popup").with(popup.id))
                .order(egui::Order::Tooltip)
                .anchor(egui::Align2::CENTER_TOP, [0.0, y_offset])
                .show(ctx, |ui| {
                    ui.multiply_opacity(anim);
                    egui::Frame::none()
                        .fill(bg_color)
                        .rounding(Rounding::same(10.0))
                        .inner_margin(Margin::same(21.0))
                        .show(ui, |ui| {
                            ui.horizontal(|ui| {
                                let icon = match popup.popup_type { PopupType::Error => "❌", PopupType::Success => "✅" };
                                ui.label(egui::RichText::new(icon).size(24.0).color(Color32::WHITE));
                                ui.add_space(15.0);
                                ui.vertical(|ui| {
                                    let title = match popup.popup_type { PopupType::Error => "Error", PopupType::Success => "Success" };
                                    ui.label(egui::RichText::new(title).size(18.0).color(Color32::WHITE).strong());
                                    ui.label(egui::RichText::new(&popup.message).size(14.0).color(Color32::WHITE));
                                });
                            });
                        });
                });
        }
    }
}