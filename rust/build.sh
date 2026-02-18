#!/bin/bash
# Build script for Cube App (Rust)

set -e

echo "Building Cube App (Rust Edition)..."

# Check if cargo is installed
if ! command -v cargo &> /dev/null; then
    echo "Error: Cargo not found. Please install Rust first."
    echo "Visit: https://rustup.rs/"
    exit 1
fi

# Detect architecture
ARCH=$(uname -m)
echo "Detected architecture: $ARCH"

# Build based on mode
MODE=${1:-release}

if [ "$MODE" = "dev" ]; then
    echo "Building in development mode..."
    cargo build
    echo "Binary at: target/debug/cube-app"
else
    echo "Building in release mode (optimized)..."
    cargo build --release
    echo "Binary at: target/release/cube-app"
    
    # Strip binary for smaller size
    if command -v strip &> /dev/null; then
        strip target/release/cube-app
        echo "Binary stripped for minimal size"
    fi
fi

echo "Build complete!"
echo ""
echo "To run: ./target/$( [ \"$MODE\" = \"dev\" ] && echo \"debug\" || echo \"release\" )/cube-app"