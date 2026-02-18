use eframe::egui::{self, Color32, FontId, Pos2, Rect, Response, Sense, Vec2};
use crate::app::{CubeApp, PopupType};
use crate::translations::Translations;

pub struct UI<'a> {
    app: &'a mut CubeApp,
    translations: &'a Translations,
}

impl<'a> UI<'a> {
    pub fn new(app: &'a mut CubeApp, translations: &'a Translations) -> Self {
        Self { app, translations }
    }

    pub fn render(&mut self, ctx: &egui::Context) {
        // Render popups
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
        egui::CentralPanel::default().show(ctx, |ui| {
            ui.vertical_centered(|ui| {
                ui.add_space(200.0);
                
                ui.heading(
                    egui::RichText::new(self.translations.get("welcome", self.app.language))
                        .size(40.0)
                );
                
                ui.add_space(30.0);
                
                ui.label(
                    egui::RichText::new(self.translations.get("tutorial", self.app.language))
                        .size(20.0)
                );
                
                ui.add_space(50.0);
                
                ui.horizontal(|ui| {
                    if ui.button(
                        egui::RichText::new(self.translations.get("skip", self.app.language))
                            .size(18.0)
                    ).clicked() {
                        self.app.show_tutorial = false;
                    }
                    
                    ui.add_space(20.0);
                    
                    if ui.button(
                        egui::RichText::new(self.translations.get("next", self.app.language))
                            .size(18.0)
                    ).clicked() {
                        self.app.show_tutorial = false;
                    }
                });
            });
        });
    }

    fn render_grid(&mut self, ctx: &egui::Context) {
        egui::CentralPanel::default().show(ctx, |ui| {
            // Options button (top-left)
            ui.allocate_ui_at_rect(
                Rect::from_min_size(Pos2::new(20.0, 20.0), Vec2::new(50.0, 50.0)),
                |ui| {
                    if ui.button("☰").clicked() {
                        self.app.show_options = !self.app.show_options;
                    }
                },
            );

            // Center the grid
            ui.vertical_centered(|ui| {
                ui.add_space(150.0);

                let cell_size = 80.0;
                let spacing = 10.0;

                egui::Grid::new("cube_grid")
                    .spacing([spacing, spacing])
                    .show(ui, |ui| {
                        for row in 0..5 {
                            for col in 0..5 {
                                let is_active = self.app.grid[row][col] == 1;
                                let color = if is_active {
                                    Color32::from_rgb(100, 200, 255)
                                } else {
                                    Color32::from_rgb(60, 60, 60)
                                };

                                let (rect, response) = ui.allocate_exact_size(
                                    Vec2::splat(cell_size),
                                    Sense::click(),
                                );

                                if response.clicked() {
                                    self.app.handle_cell_click(row, col);
                                }

                                ui.painter().rect_filled(
                                    rect,
                                    5.0,
                                    color,
                                );
                            }
                            ui.end_row();
                        }
                    });

                ui.add_space(50.0);

                // Scan button
                let button_text = self.translations.get("scan", self.app.language);
                if ui.button(
                    egui::RichText::new(button_text)
                        .size(24.0)
                        .color(Color32::WHITE)
                ).clicked() {
                    self.app.scan_code();
                }
            });
        });
    }

    fn render_results(&mut self, ctx: &egui::Context) {
        egui::CentralPanel::default().show(ctx, |ui| {
            // Back button
            ui.allocate_ui_at_rect(
                Rect::from_min_size(Pos2::new(20.0, 20.0), Vec2::new(100.0, 40.0)),
                |ui| {
                    if ui.button("← Back").clicked() {
                        self.app.show_results = false;
                        self.app.current_file = None;
                        self.app.pdf_page = 0;
                    }
                },
            );

            // Info button
            ui.allocate_ui_at_rect(
                Rect::from_min_size(Pos2::new(130.0, 20.0), Vec2::new(40.0, 40.0)),
                |ui| {
                    if ui.button("ℹ").clicked() {
                        self.app.load_explanation(&self.app.current_code.clone());
                    }
                },
            );

            // File viewer
            ui.vertical_centered(|ui| {
                if self.app.is_loading {
                    ui.add_space(300.0);
                    ui.spinner();
                    ui.label("Loading...");
                } else if let Some(ref content) = self.app.current_file {
                    self.render_file_content(ui, content);
                } else {
                    ui.label("No content to display");
                }
            });
        });
    }

    fn render_file_content(&mut self, ui: &mut egui::Ui, content: &crate::file_handler::FileContent) {
        use crate::file_handler::FileContent;

        match content {
            FileContent::Text(text) => {
                egui::ScrollArea::vertical().show(ui, |ui| {
                    ui.add_space(80.0);
                    ui.label(egui::RichText::new(text).size(16.0));
                });
            }
            FileContent::Image(texture) => {
                ui.add_space(50.0);
                ui.image(texture);
            }
            FileContent::Pdf { pages, .. } => {
                if !pages.is_empty() {
                    ui.add_space(50.0);
                    
                    if let Some(texture) = pages.get(self.app.pdf_page) {
                        ui.image(texture);
                    }

                    ui.add_space(20.0);

                    ui.horizontal(|ui| {
                        if self.app.pdf_page > 0 {
                            if ui.button("← Previous").clicked() {
                                self.app.pdf_page -= 1;
                            }
                        }

                        ui.label(format!("Page {} / {}", self.app.pdf_page + 1, pages.len()));

                        if self.app.pdf_page < pages.len() - 1 {
                            if ui.button("Next →").clicked() {
                                self.app.pdf_page += 1;
                            }
                        }
                    });
                }
            }
            FileContent::Audio(_) => {
                ui.add_space(300.0);
                ui.label("🎵 Audio playing...");
                ui.label("(Audio playback is active in background)");
            }
            FileContent::Video => {
                ui.add_space(300.0);
                ui.label("🎬 Video Player");
                ui.label("(Video playback requires external player)");
            }
            FileContent::Html(html) => {
                egui::ScrollArea::vertical().show(ui, |ui| {
                    ui.add_space(80.0);
                    ui.label("HTML Content:");
                    ui.separator();
                    ui.label(html);
                });
            }
        }
    }

    fn render_options(&mut self, ctx: &egui::Context) {
        egui::Window::new("")
            .title_bar(false)
            .anchor(egui::Align2::LEFT_TOP, [80.0, 20.0])
            .fixed_size([200.0, 300.0])
            .show(ctx, |ui| {
                if ui.button(format!("📜 {}", self.translations.get("history", self.app.language))).clicked() {
                    self.app.show_history = true;
                    self.app.show_options = false;
                }

                if ui.button(format!("❓ {}", self.translations.get("help", self.app.language))).clicked() {
                    self.app.show_tutorial = true;
                    self.app.show_options = false;
                }

                let lang_text = self.translations.get("language", self.app.language);
                if ui.button(format!("🌐 {}", lang_text)).clicked() {
                    use crate::translations::Language;
                    self.app.language = match self.app.language {
                        Language::English => Language::Italian,
                        Language::Italian => Language::English,
                    };
                }
            });

        // Click outside to close
        let response = ctx.input(|i| i.pointer.any_click());
        if response && !ctx.wants_pointer_input() {
            self.app.show_options = false;
        }
    }

    fn render_history(&mut self, ctx: &egui::Context) {
        let mut open = self.app.show_history;
        
        egui::Window::new(self.translations.get("history", self.app.language))
            .open(&mut open)
            .anchor(egui::Align2::CENTER_CENTER, [0.0, 0.0])
            .fixed_size([400.0, 500.0])
            .show(ctx, |ui| {
                egui::ScrollArea::vertical().show(ui, |ui| {
                    let items = self.app.history.get_items();
                    
                    if items.is_empty() {
                        ui.label(self.translations.get("historyEmpty", self.app.language));
                    } else {
                        for item in items {
                            ui.horizontal(|ui| {
                                let code = item.code.clone();
                                if ui.button(&item.code).clicked() {
                                    self.app.open_history_project(code);
                                }
                                ui.label(format!(" - {}", item.timestamp.format("%H:%M:%S")));
                            });
                            ui.separator();
                        }
                    }
                });

                ui.add_space(10.0);
                
                if ui.button(self.translations.get("close", self.app.language)).clicked() {
                    open = false;
                }
            });

        self.app.show_history = open;
    }

    fn render_explanation(&mut self, ctx: &egui::Context) {
        let mut open = self.app.show_explanation;
        
        let category = self.app.get_category(&self.app.current_code);
        let title = format!("{}: {}", category, self.app.current_code);
        
        egui::Window::new(title)
            .open(&mut open)
            .anchor(egui::Align2::CENTER_CENTER, [0.0, 0.0])
            .fixed_size([600.0, 400.0])
            .show(ctx, |ui| {
                egui::ScrollArea::vertical().show(ui, |ui| {
                    ui.label(&self.app.explanation_content);
                });

                ui.add_space(10.0);
                
                if ui.button(self.translations.get("close", self.app.language)).clicked() {
                    open = false;
                }
            });

        self.app.show_explanation = open;
    }

    fn render_popups(&self, ctx: &egui::Context) {
        for (i, popup) in self.app.popups.iter().enumerate() {
            let y_offset = 20.0 + (i as f32 * 100.0);
            
            egui::Window::new("")
                .title_bar(false)
                .anchor(egui::Align2::RIGHT_TOP, [-20.0, y_offset])
                .fixed_size([300.0, 80.0])
                .show(ctx, |ui| {
                    ui.horizontal(|ui| {
                        let icon = match popup.popup_type {
                            PopupType::Error => "❌",
                            PopupType::Success => "✅",
                        };
                        ui.label(egui::RichText::new(icon).size(30.0));
                        
                        ui.vertical(|ui| {
                            let title = match popup.popup_type {
                                PopupType::Error => "Error",
                                PopupType::Success => "Success",
                            };
                            ui.label(egui::RichText::new(title).strong());
                            ui.label(&popup.message);
                        });
                    });
                });
        }
    }
}