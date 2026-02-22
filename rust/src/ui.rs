use eframe::egui::{self, Color32, Pos2, Rect, Sense, Vec2, Rounding, Stroke, Margin};
use crate::app::{CubeApp, PopupType};

// CSS Var equivalents
const BACKGROUND_COLOR: Color32 = Color32::from_rgb(236, 230, 240); // #ECE6F0
const ACTION_BUTTON_COLOR: Color32 = Color32::from_rgb(101, 85, 143); // #65558F
const BUTTON_COLOR: Color32 = Color32::from_rgb(29, 27, 32); // #1D1B20
const PRIMARY_TEXT_COLOR: Color32 = Color32::from_rgb(29, 27, 32); // #1D1B20
const SECONDARY_TEXT_COLOR: Color32 = Color32::from_rgb(73, 69, 79); // #49454F
const SECONDARY_BUTTON_BG: Color32 = Color32::from_rgb(218, 207, 216); // #DACFD8

const DARK_BACKGROUND_COLOR: Color32 = Color32::from_rgb(26, 26, 26); // #1a1a1a
const DARK_ACTION_BUTTON_COLOR: Color32 = Color32::from_rgb(143, 132, 198); // #8f84c6
const DARK_BUTTON_COLOR: Color32 = Color32::from_rgb(224, 224, 224); // #e0e0e0
const DARK_PRIMARY_TEXT_COLOR: Color32 = Color32::from_rgb(224, 224, 224); // #e0e0e0

pub struct UI<'a> {
    app: &'a mut CubeApp,
}

impl<'a> UI<'a> {
    pub fn new(app: &'a mut CubeApp) -> Self {
        Self { app }
    }

    pub fn render(&mut self, ctx: &egui::Context) {
        // Apply global style matching CSS
        let mut style = (*ctx.style()).clone();
        
        let bg_color = BACKGROUND_COLOR; // Assuming light mode default
        let text_color = PRIMARY_TEXT_COLOR;
        let action_btn = ACTION_BUTTON_COLOR;
        
        style.visuals.window_fill = bg_color;
        style.visuals.panel_fill = bg_color;
        style.visuals.override_text_color = Some(text_color);
        style.visuals.widgets.noninteractive.bg_fill = bg_color;
        style.visuals.widgets.noninteractive.fg_stroke = Stroke::new(1.0, text_color);
        
        // Buttons (Action)
        style.visuals.widgets.inactive.bg_fill = action_btn;
        style.visuals.widgets.inactive.rounding = Rounding::same(10.0);
        style.visuals.widgets.inactive.fg_stroke = Stroke::new(1.0, Color32::WHITE);
        
        style.visuals.widgets.hovered.bg_fill = action_btn.linear_multiply(0.9);
        style.visuals.widgets.hovered.rounding = Rounding::same(10.0);
        style.visuals.widgets.hovered.fg_stroke = Stroke::new(1.0, Color32::WHITE);
        
        style.visuals.widgets.active.bg_fill = action_btn.linear_multiply(0.8);
        style.visuals.widgets.active.rounding = Rounding::same(10.0);
        style.visuals.widgets.active.fg_stroke = Stroke::new(1.0, Color32::WHITE);

        ctx.set_style(style);

        self.render_popups(ctx);

        if self.app.show_tutorial {
            self.render_tutorial(ctx);
            return;
        }

        if self.app.show_results {
            self.render_results(ctx);
        } else {
            self.render_grid(ctx);
        }

        if self.app.show_options {
            self.render_options(ctx);
        }

        if self.app.show_history {
            self.render_history(ctx);
        }

        if self.app.show_explanation {
            self.render_explanation(ctx);
        }
    }

    fn render_tutorial(&mut self, ctx: &egui::Context) {
        let welcome = self.app.translations.get("welcome", self.app.language).to_string();
        let tutorial = self.app.translations.get("tutorial", self.app.language).to_string();
        let skip = self.app.translations.get("skip", self.app.language).to_string();
        let next = self.app.translations.get("next", self.app.language).to_string();

        // Tutorial container background (blur simulation)
        egui::Area::new("tutorial_bg")
            .fixed_pos(Pos2::ZERO)
            .show(ctx, |ui| {
                let rect = Rect::from_min_size(Pos2::ZERO, ctx.screen_rect().size());
                ui.painter().rect_filled(rect, 0.0, Color32::from_black_alpha(50));
            });

        // Tutorial content box
        egui::Window::new("")
            .title_bar(false)
            .anchor(egui::Align2::CENTER_CENTER, [0.0, 0.0])
            .resizable(false)
            .collapsible(false)
            .frame(egui::Frame {
                inner_margin: Margin::same(24.0),
                rounding: Rounding::same(30.0),
                fill: BACKGROUND_COLOR,
                ..Default::default()
            })
            .show(ctx, |ui| {
                ui.set_width(312.0);
                
                ui.vertical(|ui| {
                    ui.add(egui::Label::new(
                        egui::RichText::new(welcome)
                            .size(24.0)
                            .color(PRIMARY_TEXT_COLOR)
                            .strong()
                    ));
                    
                    ui.add_space(6.0);
                    
                    ui.add(egui::Label::new(
                        egui::RichText::new(tutorial)
                            .size(16.0)
                            .color(PRIMARY_TEXT_COLOR)
                    ));
                    
                    ui.add_space(20.0);
                    
                    ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                        // Make these text-only buttons matching CSS `background: none; color: var(--action-button-color);`
                        let mut style = (*ctx.style()).clone();
                        style.visuals.widgets.inactive.bg_fill = Color32::TRANSPARENT;
                        style.visuals.widgets.hovered.bg_fill = Color32::TRANSPARENT;
                        style.visuals.widgets.active.bg_fill = Color32::TRANSPARENT;
                        ui.style_mut().visuals = style.visuals;

                        if ui.add(egui::Button::new(
                            egui::RichText::new(next).color(ACTION_BUTTON_COLOR)
                        )).clicked() {
                            self.app.show_tutorial = false;
                        }
                        
                        ui.add_space(10.0);
                        
                        if ui.add(egui::Button::new(
                            egui::RichText::new(skip).color(ACTION_BUTTON_COLOR)
                        )).clicked() {
                            self.app.show_tutorial = false;
                        }
                    });
                });
            });
    }

    fn render_grid(&mut self, ctx: &egui::Context) {
        let scan_text = self.app.translations.get("scan", self.app.language).to_string();

        egui::CentralPanel::default().show(ctx, |ui| {
            // Options button (top-right, per CSS .options-button)
            let rect = Rect::from_min_size(
                Pos2::new(ui.max_rect().width() - 93.0, 50.0), 
                Vec2::new(43.0, 43.0)
            );
            ui.allocate_new_ui(egui::UiBuilder::new().max_rect(rect), |ui| {
                let mut style = (*ctx.style()).clone();
                style.visuals.widgets.inactive.bg_fill = Color32::TRANSPARENT;
                style.visuals.widgets.hovered.bg_fill = Color32::TRANSPARENT;
                ui.style_mut().visuals = style.visuals;
                
                if ui.button(egui::RichText::new("☰").size(30.0).color(BUTTON_COLOR)).clicked() {
                    self.app.show_options = !self.app.show_options;
                }
            });

            // Center the grid (.grid-component)
            ui.vertical_centered(|ui| {
                ui.add_space((ui.available_height() - 600.0) / 2.0); // vertical centering roughly

                let cell_size = 100.0; // .grid-cell { width: 100px; height: 100px; }
                let spacing = 30.0;    // .grid-container { gap: 30px; }

                egui::Grid::new("cube_grid")
                    .spacing([spacing, spacing])
                    .show(ui, |ui| {
                        for row in 0..5 {
                            for col in 0..5 {
                                let is_active = self.app.grid[row][col] == 1;

                                let (rect, response) = ui.allocate_exact_size(
                                    Vec2::splat(cell_size),
                                    Sense::click(),
                                );

                                if response.clicked() {
                                    self.app.handle_cell_click(row, col);
                                }

                                // CSS logic:
                                // .active: background: none, border: 5px solid BUTTON_COLOR
                                // .inactive: background: BUTTON_COLOR, border: none
                                if is_active {
                                    ui.painter().rect_stroke(
                                        rect,
                                        Rounding::same(10.0),
                                        Stroke::new(5.0, BUTTON_COLOR),
                                    );
                                } else {
                                    ui.painter().rect_filled(
                                        rect,
                                        Rounding::same(10.0),
                                        BUTTON_COLOR,
                                    );
                                }
                            }
                            ui.end_row();
                        }
                    });

                ui.add_space(40.0); // Gap between grid and scan button

                // Scan button (.scan-button)
                let (rect, response) = ui.allocate_exact_size(
                    Vec2::new(456.0, 73.0),
                    Sense::click(),
                );

                if response.clicked() {
                    self.app.scan_code(ctx);
                }

                let is_hovered = response.hovered();
                
                // Border 5px solid button-color, transparent bg
                ui.painter().rect_stroke(
                    rect,
                    Rounding::same(10.0),
                    Stroke::new(5.0, BUTTON_COLOR),
                );

                let text_pos = rect.center();
                ui.painter().text(
                    text_pos,
                    egui::Align2::CENTER_CENTER,
                    scan_text,
                    egui::FontId::proportional(24.0),
                    BUTTON_COLOR,
                );
            });
        });
    }

    fn render_results(&mut self, ctx: &egui::Context) {
        let code = self.app.current_code.clone();
        
        egui::CentralPanel::default().show(ctx, |ui| {
            // .back-button: fixed, top 34px, left 34px, 43x43, #DACFD8
            let back_rect = Rect::from_min_size(Pos2::new(34.0, 34.0), Vec2::new(43.0, 43.0));
            ui.allocate_new_ui(egui::UiBuilder::new().max_rect(back_rect), |ui| {
                let mut style = (*ctx.style()).clone();
                style.visuals.widgets.inactive.bg_fill = SECONDARY_BUTTON_BG;
                style.visuals.widgets.hovered.bg_fill = SECONDARY_BUTTON_BG.linear_multiply(0.9);
                style.visuals.widgets.inactive.rounding = Rounding::same(10.0);
                ui.style_mut().visuals = style.visuals;
                
                if ui.button(egui::RichText::new("←").size(24.0).color(PRIMARY_TEXT_COLOR)).clicked() {
                    self.app.show_results = false;
                    self.app.current_file = None;
                    self.app.pdf_page = 0;
                }
            });

            // .info-button: fixed, top 34px, right 34px, 43x43, #DACFD8
            let info_rect = Rect::from_min_size(Pos2::new(ui.max_rect().width() - 77.0, 34.0), Vec2::new(43.0, 43.0));
            ui.allocate_new_ui(egui::UiBuilder::new().max_rect(info_rect), |ui| {
                let mut style = (*ctx.style()).clone();
                style.visuals.widgets.inactive.bg_fill = SECONDARY_BUTTON_BG;
                style.visuals.widgets.hovered.bg_fill = SECONDARY_BUTTON_BG.linear_multiply(0.9);
                style.visuals.widgets.inactive.rounding = Rounding::same(10.0);
                ui.style_mut().visuals = style.visuals;
                
                if ui.button(egui::RichText::new("ℹ").size(24.0).color(PRIMARY_TEXT_COLOR)).clicked() {
                    self.app.load_explanation(&code);
                }
            });

            // File viewer (.file-viewer)
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
                                        ui.add(
                                            egui::Image::new(texture)
                                                .max_width(avail.x)
                                                .max_height(avail.y)
                                        );
                                    }

                                    // .pdf-navigation
                                    let nav_y = ui.max_rect().height() - 84.0;
                                    let nav_rect = Rect::from_min_size(Pos2::new(0.0, nav_y), Vec2::new(ui.max_rect().width(), 60.0));
                                    ui.allocate_new_ui(egui::UiBuilder::new().max_rect(nav_rect), |ui| {
                                        ui.horizontal_centered(|ui| {
                                            let mut style = (*ctx.style()).clone();
                                            style.visuals.widgets.inactive.bg_fill = SECONDARY_BUTTON_BG;
                                            style.visuals.widgets.inactive.rounding = Rounding::same(10.0);
                                            ui.style_mut().visuals = style.visuals;
                                            
                                            // Center nav cluster
                                            ui.add_space((ui.available_width() - 150.0) / 2.0);
                                            
                                            if page > 0 {
                                                if ui.add_sized([60.0, 60.0], egui::Button::new(egui::RichText::new("←").size(24.0).color(Color32::BLACK))).clicked() {
                                                    prev_clicked = true;
                                                }
                                            } else {
                                                ui.add_space(68.0);
                                            }

                                            ui.add_space(30.0);

                                            if page < pages.len() - 1 {
                                                if ui.add_sized([60.0, 60.0], egui::Button::new(egui::RichText::new("→").size(24.0).color(Color32::BLACK))).clicked() {
                                                    next_clicked = true;
                                                }
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
                    } else {
                        ui.label("No content to display");
                    }
                    
                    if prev_clicked {
                        self.app.pdf_page -= 1;
                    }
                    if next_clicked {
                        self.app.pdf_page += 1;
                    }
                }
            });
        });
    }

    fn render_options(&mut self, ctx: &egui::Context) {
        let mut show_history = false;
        let mut show_tutorial = false;
        let mut toggle_lang = false;
        
        let history_str = self.app.translations.get("history", self.app.language).to_string();
        let help_str = self.app.translations.get("help", self.app.language).to_string();
        let lang_str = self.app.translations.get("language", self.app.language).to_string();

        // Options bg overlay (.options-container)
        egui::Area::new("options_bg")
            .fixed_pos(Pos2::ZERO)
            .show(ctx, |ui| {
                let rect = Rect::from_min_size(Pos2::ZERO, ctx.screen_rect().size());
                ui.painter().rect_filled(rect, 0.0, Color32::from_black_alpha(50));
            });

        // .options-popup (fixed top 34 right 34)
        egui::Window::new("")
            .title_bar(false)
            .anchor(egui::Align2::RIGHT_TOP, [-34.0, 34.0])
            .resizable(false)
            .frame(egui::Frame {
                inner_margin: Margin::same(24.0),
                rounding: Rounding::same(10.0),
                fill: BACKGROUND_COLOR,
                ..Default::default()
            })
            .show(ctx, |ui| {
                
                let mut style = (*ctx.style()).clone();
                style.visuals.widgets.inactive.bg_fill = Color32::TRANSPARENT;
                style.visuals.widgets.hovered.bg_fill = Color32::TRANSPARENT;
                ui.style_mut().visuals = style.visuals;
                
                ui.vertical(|ui| {
                    if ui.button(egui::RichText::new(format!("📜 {}", history_str)).strong().size(15.0).color(PRIMARY_TEXT_COLOR)).clicked() {
                        show_history = true;
                    }
                    ui.add_space(20.0);
                    if ui.button(egui::RichText::new(format!("❓ {}", help_str)).strong().size(15.0).color(PRIMARY_TEXT_COLOR)).clicked() {
                        show_tutorial = true;
                    }
                    ui.add_space(20.0);
                    if ui.button(egui::RichText::new(format!("🌐 {}", lang_str)).strong().size(15.0).color(PRIMARY_TEXT_COLOR)).clicked() {
                        toggle_lang = true;
                    }
                });
            });

        if show_history {
            self.app.show_history = true;
            self.app.show_options = false;
        }
        
        if show_tutorial {
            self.app.show_tutorial = true;
            self.app.show_options = false;
        }
        
        if toggle_lang {
            use crate::translations::Language;
            self.app.language = match self.app.language {
                Language::English => Language::Italian,
                Language::Italian => Language::English,
            };
        }

        let response = ctx.input(|i| i.pointer.any_click());
        if response && !ctx.wants_pointer_input() {
            self.app.show_options = false;
        }
    }

    fn render_history(&mut self, ctx: &egui::Context) {
        let mut open = self.app.show_history;
        let mut project_to_open = None;
        let mut close_clicked = false;
        
        let history_title = self.app.translations.get("history", self.app.language).to_string();
        let empty_str = self.app.translations.get("historyEmpty", self.app.language).to_string();
        let close_str = self.app.translations.get("close", self.app.language).to_string();
        
        // bg blur
        egui::Area::new("history_bg").fixed_pos(Pos2::ZERO).show(ctx, |ui| {
            ui.painter().rect_filled(ctx.screen_rect(), 0.0, Color32::from_black_alpha(50));
        });

        egui::Window::new("")
            .title_bar(false)
            .anchor(egui::Align2::CENTER_CENTER, [0.0, 0.0])
            .resizable(false)
            .frame(egui::Frame {
                inner_margin: Margin::same(30.0),
                rounding: Rounding::same(15.0),
                fill: BACKGROUND_COLOR,
                ..Default::default()
            })
            .show(ctx, |ui| {
                ui.set_width(340.0); // max-width 400px with padding

                ui.heading(egui::RichText::new(history_title).size(24.0).color(PRIMARY_TEXT_COLOR));
                ui.add_space(10.0);

                egui::ScrollArea::vertical().max_height(300.0).show(ui, |ui| {
                    let items = self.app.history.get_items();
                    
                    if items.is_empty() {
                        ui.label(empty_str);
                    } else {
                        for item in items {
                            ui.horizontal(|ui| {
                                let code = item.code.clone();
                                
                                let mut style = (*ctx.style()).clone();
                                style.visuals.widgets.inactive.bg_fill = Color32::TRANSPARENT;
                                ui.style_mut().visuals = style;
                                
                                if ui.button(egui::RichText::new(&item.code).strong().color(PRIMARY_TEXT_COLOR)).clicked() {
                                    project_to_open = Some(code);
                                }
                                
                                ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                                    ui.label(egui::RichText::new(item.timestamp.format("%H:%M:%S").to_string()).size(12.0).color(SECONDARY_TEXT_COLOR));
                                });
                            });
                            
                            // subtle border-bottom
                            ui.painter().line_segment(
                                [ui.cursor().min, Pos2::new(ui.cursor().max.x, ui.cursor().min.y)],
                                Stroke::new(0.5, Color32::from_rgb(169, 169, 169))
                            );
                            ui.add_space(5.0);
                        }
                    }
                });

                ui.add_space(20.0);
                
                let mut style = (*ctx.style()).clone();
                style.visuals.widgets.inactive.bg_fill = ACTION_BUTTON_COLOR;
                style.visuals.widgets.inactive.rounding = Rounding::same(5.0);
                ui.style_mut().visuals = style;

                if ui.button(egui::RichText::new(close_str).color(Color32::WHITE).size(16.0)).clicked() {
                    close_clicked = true;
                }
            });

        if close_clicked {
            self.app.show_history = false;
        } else {
            self.app.show_history = open;
        }

        if let Some(code) = project_to_open {
            self.app.open_history_project(ctx, code);
        }
    }

    fn render_explanation(&mut self, ctx: &egui::Context) {
        let mut open = self.app.show_explanation;
        let mut close_clicked = false;
        
        let category = self.app.get_category(&self.app.current_code).to_string();
        let title = format!("{}: {}", category, self.app.current_code);
        let close_str = self.app.translations.get("close", self.app.language).to_string();
        
        // bg blur
        egui::Area::new("exp_bg").fixed_pos(Pos2::ZERO).show(ctx, |ui| {
            ui.painter().rect_filled(ctx.screen_rect(), 0.0, Color32::from_black_alpha(128));
        });

        egui::Window::new("")
            .title_bar(false)
            .anchor(egui::Align2::CENTER_CENTER, [0.0, 0.0])
            .resizable(false)
            .frame(egui::Frame {
                inner_margin: Margin::same(20.0),
                rounding: Rounding::same(10.0),
                fill: BACKGROUND_COLOR,
                ..Default::default()
            })
            .show(ctx, |ui| {
                ui.set_max_width(ctx.screen_rect().width() * 0.5);
                ui.set_max_height(ctx.screen_rect().height() * 0.8);

                ui.heading(egui::RichText::new(title).size(24.0).color(PRIMARY_TEXT_COLOR));
                ui.add_space(10.0);

                egui::ScrollArea::vertical().show(ui, |ui| {
                    ui.label(egui::RichText::new(&self.app.explanation_content).size(16.0).color(PRIMARY_TEXT_COLOR));
                });

                ui.add_space(20.0);
                
                let mut style = (*ctx.style()).clone();
                style.visuals.widgets.inactive.bg_fill = ACTION_BUTTON_COLOR;
                style.visuals.widgets.inactive.rounding = Rounding::same(5.0);
                ui.style_mut().visuals = style;

                if ui.button(egui::RichText::new(close_str).color(Color32::WHITE).size(16.0)).clicked() {
                    close_clicked = true;
                }
            });

        if close_clicked {
            self.app.show_explanation = false;
        } else {
            self.app.show_explanation = open;
        }
    }

    fn render_popups(&self, ctx: &egui::Context) {
        for (i, popup) in self.app.popups.iter().enumerate() {
            let y_offset = 20.0 + (i as f32 * 100.0);
            
            let bg_color = match popup.popup_type {
                PopupType::Error => Color32::from_rgb(250, 88, 88), // #FA5858
                PopupType::Success => Color32::from_rgb(69, 196, 91), // #45C45B
            };

            egui::Window::new(&popup.id.to_string())
                .title_bar(false)
                .anchor(egui::Align2::CENTER_TOP, [0.0, y_offset])
                .resizable(false)
                .frame(egui::Frame {
                    inner_margin: Margin::same(21.0),
                    rounding: Rounding::same(10.0),
                    fill: bg_color,
                    shadow: egui::epaint::Shadow {
                        extrusion: 12.0,
                        color: Color32::from_black_alpha(38), // 0.15 opacity
                    },
                    ..Default::default()
                })
                .show(ctx, |ui| {
                    ui.horizontal(|ui| {
                        let icon = match popup.popup_type {
                            PopupType::Error => "❌",
                            PopupType::Success => "✅",
                        };
                        ui.label(egui::RichText::new(icon).size(24.0).color(Color32::WHITE));
                        ui.add_space(15.0);
                        
                        ui.vertical(|ui| {
                            let title = match popup.popup_type {
                                PopupType::Error => "Error",
                                PopupType::Success => "Success",
                            };
                            ui.label(egui::RichText::new(title).size(18.0).color(Color32::WHITE).strong());
                            ui.label(egui::RichText::new(&popup.message).size(14.0).color(Color32::WHITE));
                        });
                    });
                });
        }
    }
}