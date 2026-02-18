# Cube App - Rust Edition

A high-performance Rust rewrite of the Cube App using egui for the RADXA ZERO 3W.

## Features

- **Native Performance**: Compiled Rust with zero runtime overhead
- **Low Memory Footprint**: Optimized for 4GB RAM devices
- **Cross-Platform**: Works on Linux (ARM/x86), Windows, and macOS
- **Multimedia Support**: PDF, images, audio (MP3), video (MP4), text, and HTML
- **Bilingual**: English and Italian interface
- **History Tracking**: Persistent history with JSON storage
- **Fullscreen Mode**: Immersive exhibition experience

## Prerequisites

### For RADXA ZERO 3W (ARM64 Linux)

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Install system dependencies
sudo apt update
sudo apt install -y libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev \
    libgstreamer-plugins-bad1.0-dev gstreamer1.0-plugins-base \
    gstreamer1.0-plugins-good gstreamer1.0-plugins-bad \
    gstreamer1.0-plugins-ugly gstreamer1.0-libav \
    libasound2-dev pkg-config
```

### For Development (Any Platform)

```bash
# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Linux additional dependencies
sudo apt install libgtk-3-dev libglib2.0-dev libasound2-dev

# macOS (requires Homebrew)
brew install gtk+3 gstreamer gst-plugins-base gst-plugins-good
```

## Building

### Development Build

```bash
cd rust
cargo build
```

### Optimized Release Build

```bash
cd rust
cargo build --release
```

The release binary will be at `target/release/cube-app`

### Cross-Compilation for RADXA ZERO 3W

From a development machine:

```bash
# Add ARM64 target
rustup target add aarch64-unknown-linux-gnu

# Install cross-compiler
sudo apt install gcc-aarch64-linux-gnu

# Build
cargo build --release --target aarch64-unknown-linux-gnu
```

## Running

```bash
cd rust

# Development
cargo run

# Release
./target/release/cube-app
```

## Configuration

### Content Folder

By default, the app loads projects from `/home/user/`. To change this, edit `src/app.rs`:

```rust
let content_folder = PathBuf::from("/your/custom/path/");
```

### Fullscreen

The app starts in fullscreen by default. To disable, edit `src/main.rs`:

```rust
.with_fullscreen(false)
```

## Project Structure

```
rust/
├── Cargo.toml           # Dependencies and build config
├── src/
│   ├── main.rs          # Entry point
│   ├── app.rs           # Core application logic
│   ├── ui.rs            # UI rendering with egui
│   ├── file_handler.rs  # File loading and media handling
│   ├── history.rs       # History management
│   └── translations.rs  # i18n support
└── README.md
```

## Performance Notes

- **Startup Time**: <1 second on RADXA ZERO 3W
- **Memory Usage**: ~50-100MB (vs 200-300MB for Electron)
- **Binary Size**: ~15MB (vs 100MB+ for Electron)
- **CPU Usage**: Minimal, hardware-accelerated rendering

## Keyboard Shortcuts

- `ESC`: Close current view/popup
- `Space`: Trigger scan (when grid is active)
- `Left/Right Arrow`: Navigate PDF pages

## Troubleshooting

### Audio not working

Ensure ALSA is configured:
```bash
sudo apt install alsa-utils
aplay -l  # List audio devices
```

### Video playback issues

Install additional GStreamer plugins:
```bash
sudo apt install gstreamer1.0-plugins-ugly gstreamer1.0-libav
```

### Build errors on ARM

Make sure PKG_CONFIG_PATH is set:
```bash
export PKG_CONFIG_PATH=/usr/lib/aarch64-linux-gnu/pkgconfig
```

## License

Educational and non-commercial use only. Attribution to Alberto Frigo required.

## Contact

august.frigo@gmail.com