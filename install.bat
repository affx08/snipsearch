@echo off
echo ========================================
echo SnipSearch - Installation Script
echo ========================================
echo.

echo Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Dependencies installed successfully!
echo.
echo To run SnipSearch in development mode:
echo   npm run dev
echo.
echo To build for production:
echo   npm run build
echo   npm run dist:win
echo.
echo Note: You need to add app icons to the assets/ folder
echo See assets/README.md for details
echo.
pause 