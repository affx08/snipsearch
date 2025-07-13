@echo off
echo ========================================
echo SnipSearch Installation Script
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed!
    echo Please install npm from https://nodejs.org/
    pause
    exit /b 1
)

echo Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo Building application...
npm run build
if %errorlevel% neq 0 (
    echo ERROR: Failed to build application!
    pause
    exit /b 1
)

echo Creating Windows installer...
npm run dist:win
if %errorlevel% neq 0 (
    echo ERROR: Failed to create installer!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation completed successfully!
echo ========================================
echo.
echo The installer is located at: dist-electron\SnipSearch Setup 1.0.0.exe
echo.
echo To run the application in development mode:
echo   npm run dev
echo.
pause 