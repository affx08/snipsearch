# SnipSearch Installation Script
# This script installs dependencies and builds the application

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SnipSearch Installation Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if npm is installed
Write-Host "Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: npm is not installed!" -ForegroundColor Red
    Write-Host "Please install npm from https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to install dependencies!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Build application
Write-Host "Building application..." -ForegroundColor Yellow
try {
    npm run build
    Write-Host "Application built successfully!" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to build application!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Create Windows installer
Write-Host "Creating Windows installer..." -ForegroundColor Yellow
try {
    npm run dist:win
    Write-Host "Installer created successfully!" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to create installer!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installation completed successfully!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "The installer is located at: dist-electron\SnipSearch Setup 1.0.0.exe" -ForegroundColor Green
Write-Host ""
Write-Host "To run the application in development mode:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit" 