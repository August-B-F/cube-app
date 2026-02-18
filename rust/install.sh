#!/bin/bash
# Installation script for RADXA ZERO 3W

set -e

echo "=== Cube App Installer for RADXA ZERO 3W ==="
echo ""

# Check if running on ARM
ARCH=$(uname -m)
if [[ "$ARCH" != "aarch64" && "$ARCH" != "armv7l" ]]; then
    echo "Warning: Not running on ARM architecture. Detected: $ARCH"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "Installing system dependencies..."
sudo apt update
sudo apt install -y \
    libgstreamer1.0-dev \
    libgstreamer-plugins-base1.0-dev \
    libgstreamer-plugins-bad1.0-dev \
    gstreamer1.0-plugins-base \
    gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-bad \
    gstreamer1.0-plugins-ugly \
    gstreamer1.0-libav \
    libasound2-dev \
    pkg-config \
    build-essential

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
./build.sh release

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
echo ""
echo "To run the app:"
echo "  ./target/release/cube-app"
echo ""
echo "Or find it in your application menu as 'Cube App'"
echo ""