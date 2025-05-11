# Cube App

An Electron.js desktop application for Italian artist Alberto Frigo, designed to present and explore multimedia “projects” stored inside an 8*8*8 meter cube in the Alps. The cube holds many codes that can be decoded with this app. These files include text, video, audio, PDF or image files letting the artist dynamically showcase his work.

![Cube Preview](assets/cube-app-gif.gif)

---

## Overview

Cube App is a cross-platform (Windows & Linux) Electron.js application that lets you:

- Browse and display multiple project files.   
- Switch the UI language between English and Italian  
- Keep track of which projects you’ve viewed  
- View PDFs, text documents, videos, audio and images without leaving the app  

Ideal for art installations or interactive exhibitions.

---

## Table of Contents

1. [Features](#features)  
2. [Getting Started](#getting-started)  
3. [Project Structure](#project-structure)  
4. [Prerequisites](#prerequisites)  
5. [Installation & Usage](#installation--usage)  
6. [License](#license)  
7. [Contact](#contact)  

---

## Features

- **Scalable UI** that adapts to any window size  
- **Bilingual interface**: English ↔ Italian  
- **History tracking** of viewed projects  
- **Built-in viewer** for PDF, text, video, sound and images  

---

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- **Node.js** ≥ 14.x  
- **npm** (comes with Node.js)  
- **Electron** (installed via npm)  

> **Note:** macOS is untested but may work with minor tweaks.

---

## Project Structure

```

cube-app/
├── assets/
│   ├── explanations/        # English descriptions for each project
│   ├── explanations_it/     # Italian descriptions for each project
│   ├── icons/               # App icons
│   └── Inter.ttf            # Custom font file
├── js/
│   └── App.js               # Main React UI component
├── src/
│   ├── code/                # Third-party libraries and helpers
│   │   ├── babel.js
│   │   ├── pdf.js
│   │   ├── react-dom17.js
│   │   ├── react-router.js
│   │   └── react17.js
│   └── css/
│       └── style.css        # Global stylesheet
├── index.html               # App shell
├── main.js                  # Electron main process
├── preload.js               # Context-bridge setup
├── package.json             # Project metadata & dependencies
├── package-lock.json        # Exact dependency versions
├── README.md                # This document
└── node_modules/            # Installed dependencies

````

---

## Installation & Usage

1. **Clone the repo**  
   ```bash
   git clone https://github.com/Bob1883/cube-app.git
   cd cube-app
```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure your content folder**

   * By default the app loads projects from /home/user/
   * To point to a different folder, edit the `contentFolder` path in `main.js`.

4. **Run in development**

   ```bash
   npm start
   ```

5. **Build for distribution**

   ```bash
   npm run package
   ```

   This will produce platform-specific installers in `dist/`.

---

## License

This project is licensed for **educational and non-commercial use** only. You’re welcome to fork, adapt and share—please retain attribution to Alberto Frigo.

---

## Contact

For questions, feedback or collaboration inquiries, please email
[august.frigo@gmail.com](mailto:august.frigo@gmail.com)