use std::collections::HashMap;

#[derive(Clone, Copy, PartialEq)]
pub enum Language {
    English,
    Italian,
}

pub struct Translations {
    translations: HashMap<String, HashMap<String, String>>,
}

impl Translations {
    pub fn new() -> Self {
        let mut translations = HashMap::new();
        
        let mut en = HashMap::new();
        en.insert("settings".to_string(), "Settings".to_string());
        en.insert("history".to_string(), "History".to_string());
        en.insert("historyEmpty".to_string(), "History empty".to_string());
        en.insert("help".to_string(), "Help".to_string());
        en.insert("language".to_string(), "Language".to_string());
        en.insert("darkMode".to_string(), "Dark Mode".to_string());
        en.insert("fontSize".to_string(), "Font Size".to_string());
        en.insert("autoScan".to_string(), "Auto Scan".to_string());
        en.insert("scan".to_string(), "SCAN".to_string());
        en.insert("welcome".to_string(), "Welcome to the tutorial!".to_string());
        en.insert("tutorial".to_string(), "This is a simple tutorial to help you get started with the app. It shows how to use the app.".to_string());
        en.insert("skip".to_string(), "Skip tutorial".to_string());
        en.insert("next".to_string(), "Next".to_string());
        en.insert("close".to_string(), "Close".to_string());
        translations.insert("en".to_string(), en);
        
        let mut it = HashMap::new();
        it.insert("settings".to_string(), "Impostazioni".to_string());
        it.insert("history".to_string(), "Cronologia".to_string());
        it.insert("historyEmpty".to_string(), "Cronologia vuota".to_string());
        it.insert("help".to_string(), "Aiuto".to_string());
        it.insert("language".to_string(), "Lingua".to_string());
        it.insert("darkMode".to_string(), "Modalità Scura".to_string());
        it.insert("fontSize".to_string(), "Dimensione Carattere".to_string());
        it.insert("autoScan".to_string(), "Scansione Automatica".to_string());
        it.insert("scan".to_string(), "SCANSIONA".to_string());
        it.insert("welcome".to_string(), "Benvenuto nel tutorial!".to_string());
        it.insert("tutorial".to_string(), "Questo è un semplice tutorial per aiutarti a iniziare con l'app. Mostra come usare l'app.".to_string());
        it.insert("skip".to_string(), "Salta tutorial".to_string());
        it.insert("next".to_string(), "Avanti".to_string());
        it.insert("close".to_string(), "Chiudi".to_string());
        translations.insert("it".to_string(), it);
        
        Self { translations }
    }

    pub fn get<'a>(&'a self, key: &'a str, language: Language) -> &'a str {
        let lang_code = match language {
            Language::English => "en",
            Language::Italian => "it",
        };
        
        self.translations
            .get(lang_code)
            .and_then(|lang_map| lang_map.get(key))
            .map(|s| s.as_str())
            .unwrap_or(key)
    }
}