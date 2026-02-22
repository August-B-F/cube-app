#!/bin/bash
# Installation script for RADXA ZERO 3W / Zorin OS

set -e

echo "=== Cube App Installer ==="
echo ""

echo "Installing system dependencies..."
sudo apt update
sudo apt install -y \
    mpv \
    poppler-utils \
    libasound2-dev \
    pkg-config \
    build-essential \
    libgtk-3-dev

echo ""
echo "Checking for Rust installation..."
if ! command -v cargo &> /dev/null; then
    echo "Rust not found. Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source $HOME/.cargo/env
    echo "Rust installed successfully!"
else
    echo "Rust already installed: $(rustc --version)"
fi

echo ""
echo "Building Cube App..."
cargo build --release

echo ""
echo "Creating desktop entry..."
mkdir -p ~/.local/share/applications

cat > ~/.local/share/applications/cube-app.desktop << EOF
[Desktop Entry]
Name=Cube App
Comment=Multimedia project viewer for Alberto Frigo's cube
Exec=$(pwd)/target/release/cube-app
Icon=applications-multimedia
Terminal=false
Type=Application
Categories=AudioVideo;Player;
EOF

echo ""
echo "=== Installation Complete! ==="
echo "To run the app:"
echo "  ./target/release/cube-app"
echo ""