# SnipSearch Setup Instructions

## 🎉 Congratulations! 

You now have a complete, modern Windows 11 desktop application called **SnipSearch** that allows users to create custom search shortcuts using global hotkeys. The application features Material 3 design, system tray integration, and smooth animations.

## 📋 What's Been Created

### ✅ Complete Application Structure
- **Electron + React + TypeScript** application
- **Material 3 Design System** with Windows 11 integration
- **Global hotkey support** for search engines
- **System tray integration** with context menu
- **Startup configuration** using Windows Registry
- **Dark/Light mode** with system theme sync
- **Toast notifications** with smooth animations
- **Modern UI components** with Material 3 styling

### ✅ Features Implemented
1. **Home Page**: Search engine management with grid layout
2. **Settings Page**: Dark mode and startup configuration
3. **New Snip Dialog**: Hotkey recording and search engine creation
4. **Toast HUD**: Beautiful notifications when searches are triggered
5. **System Tray**: Quick access and context menu
6. **Global Hotkeys**: Register and manage custom shortcuts
7. **Windows Integration**: Startup behavior and theme sync

### ✅ Technical Implementation
- **Main Process**: Electron app with hotkey registration
- **Renderer Process**: React app with Material 3 UI
- **IPC Communication**: Secure communication between processes
- **Data Persistence**: Electron Store for settings and search engines
- **Build System**: Vite + Electron Builder for distribution

## 🚀 Getting Started

### Step 1: Install Dependencies

**Option A: Using the provided scripts**
```bash
# Windows Command Prompt
install.bat

# PowerShell
.\install.ps1
```

**Option B: Manual installation**
```bash
npm install
```

### Step 2: Add App Icons

Before running the application, you need to add app icons:

1. **Create or obtain app icons**:
   - `assets/icon.png` (512x512 PNG)
   - `assets/icon.ico` (Windows ICO format with multiple sizes)

2. **Icon design guidelines** (see `assets/README.md`):
   - Material 3 style with search/magnifying glass theme
   - Use primary color #6750A4
   - Rounded corners and modern appearance
   - Scalable from 16x16 to 512x512

### Step 3: Run the Application

**Development mode:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
npm run dist:win
```

## 🎯 How to Use SnipSearch

### Creating Search Engines
1. Open SnipSearch
2. Click "New Snip" button
3. Enter search engine name (e.g., "YouTube")
4. Add search URL with `{query}` placeholder:
   - `https://www.youtube.com/results?search_query={query}`
5. Click "Record" and press your desired hotkey (e.g., Alt+Y)
6. Save the search engine

### Using Search Shortcuts
1. **Select any text** on your screen
2. **Press your hotkey** (e.g., Alt+Y for YouTube)
3. **Search opens** automatically in your default browser

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
│   │   ├── Home.tsx    # Search engine management
│   │   ├── Settings.tsx # App settings
│   │   ├── NewSnipDialog.tsx # Search engine creation
│   │   └── ToastHUD.tsx # Toast notifications
│   ├── types/          # TypeScript declarations
│   ├── App.tsx         # Main React app
│   └── main.tsx        # React entry point
├── assets/             # App icons (add your icons here)
├── dist/               # Built files
└── dist-electron/      # Electron distribution
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run dist:win` - Create Windows installer
- `npm run dev:renderer` - Start Vite dev server
- `npm run dev:main` - Start Electron main process

## 🎨 Design Features

### Material 3 Implementation
- **Adaptive Colors**: Syncs with Windows accent color
- **Smooth Animations**: Expressive motion throughout
- **Elevation & Blur**: Modern depth effects
- **Rounded Corners**: Consistent 16px border radius
- **Typography**: Segoe UI for Windows integration

### Windows 11 Integration
- **System Theme Sync**: Automatic dark/light mode
- **Accent Color**: Uses Windows accent color
- **System Tray**: Native tray integration
- **Startup Registry**: Proper Windows startup configuration
- **Title Bar**: Hidden title bar with overlay

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

## 📦 Distribution

### Building the Installer
```bash
npm run build
npm run dist:win
```

The Windows installer will be created in `dist-electron/` folder.

### Distribution Files
- **Windows Installer**: `.exe` file for easy installation
- **Portable Version**: Can be run without installation
- **Auto-updater**: Built-in update mechanism

## 🐛 Troubleshooting

### Common Issues

1. **Hotkeys not working**
   - Ensure SnipSearch has focus when recording
   - Check for conflicts with other applications
   - Restart the application

2. **Text not being selected**
   - Make sure text is actually selected (highlighted)
   - Try selecting text in different applications

3. **Startup not working**
   - Check Windows startup settings
   - Ensure application has proper permissions

4. **Build errors**
   - Make sure all dependencies are installed
   - Check that app icons are in the correct location
   - Verify Node.js version (18+ required)

### Debug Mode
Run with debug logging:
```bash
npm run dev
```

## 🎯 Next Steps

### For Users
1. Add app icons to `assets/` folder
2. Run `npm run dev` to test the application
3. Create your first search engine
4. Test the hotkey functionality
5. Build the installer with `npm run dist:win`

### For Developers
1. Customize the Material 3 theme colors
2. Add more search engine presets
3. Implement additional features (search history, categories)
4. Add unit tests and integration tests
5. Set up CI/CD pipeline

## 📞 Support

- **Documentation**: See `README.md` for detailed information
- **Issues**: Create GitHub issues for bugs or feature requests
- **Contributing**: Follow the contributing guidelines in README.md

---

## 🎉 You're All Set!

SnipSearch is now ready to use! The application provides a modern, Windows 11-native experience for creating custom search shortcuts. With its Material 3 design, system tray integration, and global hotkey support, it offers a delightful and efficient way to search the web from anywhere on your system.

**Happy searching! 🔍** 