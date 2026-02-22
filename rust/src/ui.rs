use eframe::egui::{self, Color32, Pos2, Rect, Sense, Vec2};
use crate::app::{CubeApp, PopupType};

pub struct UI<'a> {
    app: &'a mut CubeApp,
}

impl<'a> UI<'a> {
    pub fn new(app: &'a mut CubeApp) -> Self {
        Self { app }
    }

    pub fn render(&mut self, ctx: &egui::Context) {
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

        egui::CentralPanel::default().show(ctx, |ui| {
            ui.vertical_centered(|ui| {
                ui.add_space(200.0);
                
                ui.heading(
                    egui::RichText::new(welcome)
                        .size(40.0)
                );
                
                ui.add_space(30.0);
                
                ui.label(
                    egui::RichText::new(tutorial)
                        .size(20.0)
                );
                
                ui.add_space(50.0);
                
                ui.horizontal(|ui| {
                    if ui.button(egui::RichText::new(skip).size(18.0)).clicked() {
                        self.app.show_tutorial = false;
                    }
                    
                    ui.add_space(20.0);
                    
                    if ui.button(egui::RichText::new(next).size(18.0)).clicked() {
                        self.app.show_tutorial = false;
                    }
                });
            });
        });
    }

    fn render_grid(&mut self, ctx: &egui::Context) {
        let scan_text = self.app.translations.get("scan", self.app.language).to_string();

        egui::CentralPanel::default().show(ctx, |ui| {
            // Options button (top-left)
            let rect = Rect::from_min_size(Pos2::new(20.0, 20.0), Vec2::new(50.0, 50.0));
            ui.allocate_new_ui(egui::UiBuilder::new().max_rect(rect), |ui| {
                if ui.button(egui::RichText::new("☰").size(24.0)).clicked() {
                    self.app.show_options = !self.app.show_options;
                }
            });

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
                if ui.button(
                    egui::RichText::new(scan_text)
                        .size(24.0)
                        .color(Color32::WHITE)
                ).clicked() {
                    self.app.scan_code(ctx);
                }
            });
        });
    }

    fn render_results(&mut self, ctx: &egui::Context) {
        let code = self.app.current_code.clone();
        
        egui::CentralPanel::default().show(ctx, |ui| {
            // Back button
            let back_rect = Rect::from_min_size(Pos2::new(20.0, 20.0), Vec2::new(100.0, 40.0));
            ui.allocate_new_ui(egui::UiBuilder::new().max_rect(back_rect), |ui| {
                if ui.button(egui::RichText::new("← Back").size(18.0)).clicked() {
                    self.app.show_results = false;
                    self.app.current_file = None;
                    self.app.pdf_page = 0;
                }
            });

            // Info button
            let info_rect = Rect::from_min_size(Pos2::new(130.0, 20.0), Vec2::new(40.0, 40.0));
            ui.allocate_new_ui(egui::UiBuilder::new().max_rect(info_rect), |ui| {
                if ui.button(egui::RichText::new("ℹ").size(18.0)).clicked() {
                    self.app.load_explanation(&code);
                }
            });

            // File viewer
            ui.vertical_centered(|ui| {
                if self.app.is_loading {
                    ui.add_space(300.0);
                    ui.spinner();
                    ui.label(egui::RichText::new("Loading...").size(24.0));
                } else {
                    let page = self.app.pdf_page;
                    let mut prev_clicked = false;
                    let mut next_clicked = false;
                    
                    if let Some(content) = &self.app.current_file {
                        use crate::file_handler::FileContent;

                        match content {
                            FileContent::Text(text) => {
                                egui::ScrollArea::vertical().show(ui, |ui| {
                                    ui.add_space(80.0);
                                    ui.label(egui::RichText::new(text).size(20.0));
                                });
                            }
                            FileContent::Image(texture) => {
                                ui.add_space(70.0);
                                let avail = ui.available_size() - egui::vec2(20.0, 20.0);
                                ui.add(
                                    egui::Image::new(texture)
                                        .max_width(avail.x)
                                        .max_height(avail.y)
                                );
                            }
                            FileContent::Pdf { pages, .. } => {
                                if !pages.is_empty() {
                                    ui.add_space(70.0);
                                    
                                    if let Some(texture) = pages.get(page) {
                                        let avail = ui.available_size() - egui::vec2(0.0, 60.0); 
                                        ui.add(
                                            egui::Image::new(texture)
                                                .max_width(avail.x)
                                                .max_height(avail.y)
                                        );
                                    }

                                    ui.add_space(10.0);
                                    ui.horizontal(|ui| {
                                        if page > 0 {
                                            if ui.button("← Previous").clicked() {
                                                prev_clicked = true;
                                            }
                                        }

                                        ui.label(format!("Page {} / {}", page + 1, pages.len()));

                                        if page < pages.len() - 1 {
                                            if ui.button("Next →").clicked() {
                                                next_clicked = true;
                                            }
                                        }
                                    });
                                }
                            }
                            FileContent::Audio(_) => {
                                ui.add_space(300.0);
                                ui.heading("🎵 Audio playing...");
                                ui.label("(Audio playback continues in background until you go back)");
                            }
                            FileContent::Video => {
                                ui.add_space(300.0);
                                ui.heading("🎬 Video Player opened");
                                ui.label("(Video playback launched in external 'mpv' window)");
                            }
                            FileContent::Html(html) => {
                                egui::ScrollArea::vertical().show(ui, |ui| {
                                    ui.add_space(80.0);
                                    ui.label(egui::RichText::new("HTML Content:").strong().size(20.0));
                                    ui.separator();
                                    ui.label(html);
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

        egui::Window::new("")
            .title_bar(false)
            .anchor(egui::Align2::LEFT_TOP, [80.0, 20.0])
            .fixed_size([200.0, 300.0])
            .show(ctx, |ui| {
                if ui.button(format!("📜 {}", history_str)).clicked() {
                    show_history = true;
                }

                if ui.button(format!("❓ {}", help_str)).clicked() {
                    show_tutorial = true;
                }

                if ui.button(format!("🌐 {}", lang_str)).clicked() {
                    toggle_lang = true;
                }
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
        
        egui::Window::new(&history_title)
            .open(&mut open)
            .anchor(egui::Align2::CENTER_CENTER, [0.0, 0.0])
            .fixed_size([400.0, 500.0])
            .show(ctx, |ui| {
                egui::ScrollArea::vertical().show(ui, |ui| {
                    let items = self.app.history.get_items();
                    
                    if items.is_empty() {
                        ui.label(empty_str);
                    } else {
                        for item in items {
                            ui.horizontal(|ui| {
                                let code = item.code.clone();
                                if ui.button(&item.code).clicked() {
                                    project_to_open = Some(code);
                                }
                                ui.label(format!(" - {}", item.timestamp.format("%H:%M:%S")));
                            });
                            ui.separator();
                        }
                    }
                });

                ui.add_space(10.0);
                
                if ui.button(close_str).clicked() {
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
        
        egui::Window::new(&title)
            .open(&mut open)
            .anchor(egui::Align2::CENTER_CENTER, [0.0, 0.0])
            .fixed_size([600.0, 400.0])
            .show(ctx, |ui| {
                egui::ScrollArea::vertical().show(ui, |ui| {
                    ui.label(egui::RichText::new(&self.app.explanation_content).size(18.0));
                });

                ui.add_space(10.0);
                
                if ui.button(close_str).clicked() {
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