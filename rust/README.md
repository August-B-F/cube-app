# Cube App - Rust Edition

A high-performance Rust rewrite of the Cube App using egui for the RADXA ZERO 3W.

## Features

- **Native Performance**: Compiled Rust with zero runtime overhead
- **Low Memory Footprint**: Optimized for 4GB RAM devices
- **Multimedia Support**:
  - Image viewing via `image` crate and native egui rendering
  - Fast PDF parsing via `pdftoppm` (poppler-utils)
  - Audio (MP3) playback natively via `rodio`
  - Video (MP4) playback launched via the highly optimized `mpv` player 
- **Bilingual**: English and Italian interface
- **History Tracking**: Persistent history with JSON storage

## Prerequisites

### For Zorin OS (Debian/Ubuntu) or RADXA ZERO 3W

The app relies on a few solid system binaries for extremely efficient media handling (instead of bloated Rust C-bindings).

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Install critical system tools for media rendering
sudo apt update
sudo apt install -y \
    mpv \
    poppler-utils \
    libasound2-dev \
    pkg-config \
    build-essential \
    libgtk-3-dev
```

## Building & Running

### Development Build

```bash
cd rust
cargo run
```

### Optimized Release Build

```bash
cd rust
cargo build --release
./target/release/cube-app
```

## Configuration

By default, the app loads projects from `/home/user/`. To change this, edit `src/app.rs`:

```rust
let content_folder = PathBuf::from("/home/yourusername/");
```

## Troubleshooting

### PDF gives an error
Make sure `poppler-utils` is installed. The app calls `pdftoppm` under the hood to quickly convert PDF pages to high-quality images.

### Video gives an error
Make sure `mpv` is installed. The app launches `mpv --fs` for lightweight, hardware-accelerated video playback.

### Audio not working
Ensure ALSA is configured. Install `alsa-utils` if missing.