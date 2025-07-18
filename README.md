# SnipSearch

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Electron](https://img.shields.io/badge/Electron-28.0.0-blue.svg)](https://electronjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.15.1-blue.svg)](https://mui.com/)

A modern Windows 11 desktop application that allows you to create custom search shortcuts using global hotkeys. Select any text on your screen and trigger a search on your preferred search engine with a simple keyboard shortcut.

## ✨ Features

- **Global Hotkeys**: Register custom keyboard shortcuts for any search engine
- **Material 3 Design**: Modern, expressive UI that adapts to Windows 11 theme
- **System Tray Integration**: Quick access from the system tray
- **Startup Support**: Option to launch automatically with Windows
- **Dark Mode**: Automatic theme synchronization with Windows
- **Toast Notifications**: Beautiful HUD notifications when searches are triggered
- **Multiple Search Engines**: Add unlimited custom search engines
- **Hotkey Recording**: Intuitive hotkey recording interface

## 🚀 Quick Start

### Download & Install

**Latest Release**: [SnipSearch Setup 1.0.0.exe](https://github.com/yourusername/snipsearch/releases/latest/download/SnipSearch-Setup-1.0.0.exe) (80MB)

1. Download the installer above
2. Run `SnipSearch Setup 1.0.0.exe`
3. Follow the installation wizard
4. Launch SnipSearch from the Start Menu or Desktop shortcut

### Development Setup

#### Prerequisites

- Windows 11 (or Windows 10)
- Node.js 18+ and npm

#### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/snipsearch.git
   cd snipsearch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run in development mode**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm run dist:win
   ```

## 📦 Distribution

### Download Latest Release

The latest Windows installer is available in the [Releases](https://github.com/affx08/snipsearch/releases) section.

**Quick Download**: [SnipSearch Setup 1.0.0.exe](https://github.com/affx08/snipsearch/releases/latest/download/SnipSearch-Setup-1.0.0.exe)

### Build Your Own

The built application will be available in the `dist-electron` folder as a Windows installer (.exe).

## 🎯 Usage

### Creating Search Engines

1. Open SnipSearch
2. Click "New Snip" or use the system tray
3. Enter a name for your search engine
4. Add the search URL with `{query}` placeholder
5. Record your desired hotkey combination
6. Save and start using!

### Using Search Shortcuts

1. **Select text** anywhere on your screen
2. **Press your hotkey** (e.g., Alt+Y for YouTube)
3. **Search opens** automatically in your default browser

#### Text Selection Tips

- **Desktop Applications**: Works seamlessly with most desktop apps
- **Web Browsers**: For best results, manually copy text (Ctrl+C) before using the hotkey
- **Text Editors**: Works great with Notepad, VS Code, Word, etc.
- **PDF Readers**: Compatible with Adobe Reader, Edge PDF viewer, etc.

The app uses multiple methods to capture selected text:
1. **Automatic Copy**: Simulates Ctrl+C to copy selected text
2. **Clipboard Detection**: Uses existing clipboard content if available
3. **Windows API**: Direct system calls for better compatibility

### Example Search Engines

| Name | URL | Hotkey |
|------|-----|--------|
| Google | `https://www.google.com/search?q={query}` | Alt+G |
| YouTube | `https://www.youtube.com/results?search_query={query}` | Alt+Y |
| GitHub | `https://github.com/search?q={query}` | Alt+H |
| Stack Overflow | `https://stackoverflow.com/search?q={query}` | Alt+S |

## 🛠️ Development

### Project Structure

```
snipsearch/
├── src/
│   ├── main/           # Electron main process
│   │   ├── main.ts     # Main application logic
│   │   └── preload.ts  # Preload script for IPC
│   ├── components/     # React components
│   │   ├── Home.tsx
│   │   ├── Settings.tsx
│   │   ├── NewSnipDialog.tsx
│   │   └── ToastHUD.tsx
│   ├── types/          # TypeScript declarations
│   ├── App.tsx         # Main React app
│   └── main.tsx        # React entry point
├── assets/             # App icons and assets
├── dist/               # Built files
└── dist-electron/      # Electron distribution
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run dist:win` - Create Windows installer
- `npm run dev:renderer` - Start Vite dev server
- `npm run dev:main` - Start Electron main process
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

### Tech Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Material-UI (MUI) with Material 3
- **Desktop**: Electron 28
- **Build Tool**: Vite
- **Package Manager**: npm

## 🎨 Design

SnipSearch follows the Material 3 Expressive Design Language with:

- **Adaptive Colors**: Automatically syncs with Windows accent color
- **Smooth Animations**: Expressive motion throughout the interface
- **Elevation & Blur**: Modern depth and transparency effects
- **Rounded Corners**: Consistent 16px border radius
- **Typography**: Segoe UI font family for Windows integration

## 🔧 Configuration

### Settings

- **Dark Mode**: Toggle between light and dark themes
- **Startup**: Enable/disable automatic startup with Windows
- **System Theme Sync**: Automatically follow Windows theme changes

### System Requirements

- **OS**: Windows 10/11
- **RAM**: 100MB minimum
- **Storage**: 50MB available space
- **Permissions**: System tray access, global hotkeys

## 🐛 Troubleshooting

### Common Issues

1. **Hotkeys not working**
   - Ensure SnipSearch has focus when recording hotkeys
   - Check for conflicts with other applications
   - Restart the application

2. **Text not being selected**
   - Make sure text is actually selected (highlighted)
   - Try selecting text in different applications

3. **Startup not working**
   - Check Windows startup settings
   - Ensure application has proper permissions

### Debug Mode

Run with debug logging:
```bash
npm run dev
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run lint && npm run type-check`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🛡️ Security

We take security seriously. Please see our [Security Policy](SECURITY.md) for details on reporting vulnerabilities.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/snipsearch/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/snipsearch/discussions)
- **Documentation**: [Wiki](https://github.com/yourusername/snipsearch/wiki)

## 🎯 Roadmap

- [ ] Custom search engine categories
- [ ] Search history
- [ ] Advanced hotkey combinations
- [ ] Plugin system
- [ ] Cross-platform support (macOS, Linux)
- [ ] Cloud sync for settings
- [ ] Voice search integration

## 📊 Project Status

![GitHub issues](https://img.shields.io/github/issues/yourusername/snipsearch)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/snipsearch)
![GitHub stars](https://img.shields.io/github/stars/yourusername/snipsearch)
![GitHub forks](https://img.shields.io/github/forks/yourusername/snipsearch)

## 🙏 Acknowledgments

- [Electron](https://electronjs.org/) for the desktop framework
- [Material-UI](https://mui.com/) for the beautiful UI components
- [React](https://reactjs.org/) for the frontend framework
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [Vite](https://vitejs.dev/) for the build tool

---

**Made with ❤️ for Windows 11 users** 