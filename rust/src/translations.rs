use std::collections::HashMap;

pub struct Translations {
    pub map: HashMap<&'static str, HashMap<Language, &'static str>>,
}

#[derive(Clone, Copy, PartialEq, Eq, Hash, Debug)]
pub enum Language {
    English,
    Italian,
}

impl Translations {
    pub fn new() -> Self {
        let mut map = HashMap::new();
        
        // Settings Menu
        map.insert("history", HashMap::from([
            (Language::English, "History"),
            (Language::Italian, "Cronologia"),
        ]));
        map.insert("help", HashMap::from([
            (Language::English, "Help"),
            (Language::Italian, "Aiuto"),
        ]));
        map.insert("language", HashMap::from([
            (Language::English, "Language: IT"),
            (Language::Italian, "Lingua: EN"),
        ]));
        map.insert("close", HashMap::from([
            (Language::English, "Close"),
            (Language::Italian, "Chiudi"),
        ]));

        // Grid Menu
        map.insert("scan", HashMap::from([
            (Language::English, "Scan Code"),
            (Language::Italian, "Scansiona Codice"),
        ]));

        // Popups
        map.insert("notFound", HashMap::from([
            (Language::English, "Object not found"),
            (Language::Italian, "Oggetto non trovato"),
        ]));

        // Tutorial
        map.insert("welcome", HashMap::from([
            (Language::English, "Welcome to the Cube App"),
            (Language::Italian, "Benvenuto nella Cube App"),
        ]));
        map.insert("tutorial", HashMap::from([
            (Language::English, "To use the application, enter a code using the 5x5 grid and click 'Scan Code'."),
            (Language::Italian, "Per usare l'applicazione, inserisci un codice usando la griglia 5x5 e clicca 'Scansiona'."),
        ]));
        map.insert("skip", HashMap::from([
            (Language::English, "Skip"),
            (Language::Italian, "Salta"),
        ]));
        map.insert("next", HashMap::from([
            (Language::English, "Got it!"),
            (Language::Italian, "Capito!"),
        ]));
        
        // History List
        map.insert("historyEmpty", HashMap::from([
            (Language::English, "No objects scanned yet."),
            (Language::Italian, "Nessun oggetto scansionato."),
        ]));

        Self { map }
    }

    pub fn get(&self, key: &str, lang: Language) -> &str {
        self.map.get(key).and_then(|m| m.get(&lang)).unwrap_or(&"")
    }
}