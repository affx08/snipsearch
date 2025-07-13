# SnipSearch Installation Script
# Run this script in PowerShell to install dependencies

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SnipSearch - Installation Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: npm is not installed or not in PATH" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Dependencies installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "To run SnipSearch in development mode:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "To build for production:" -ForegroundColor Cyan
Write-Host "  npm run build" -ForegroundColor White
Write-Host "  npm run dist:win" -ForegroundColor White
Write-Host ""
Write-Host "Note: You need to add app icons to the assets/ folder" -ForegroundColor Yellow
Write-Host "See assets/README.md for details" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit" 