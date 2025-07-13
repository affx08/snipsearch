# SnipSearch Releases

This document explains the release files and how to use them.

## 📦 Release Files

### Windows Installer
- **File**: `dist-electron/SnipSearch Setup 1.0.0.exe`
- **Size**: ~80MB
- **Type**: NSIS Windows Installer
- **Compatibility**: Windows 10/11 (64-bit)

### What's Included
- Complete SnipSearch application
- System tray integration
- Startup with Windows option
- All dependencies bundled
- No additional installation required

## 🚀 Installation Instructions

### For End Users
1. Download `SnipSearch Setup 1.0.0.exe`
2. Run the installer as administrator
3. Follow the installation wizard
4. Launch SnipSearch from Start Menu or Desktop shortcut

### For Developers
1. Clone the repository
2. Run `npm install`
3. Run `npm run dev` for development
4. Run `npm run dist:win` to build installer

## 🔧 Build Process

The executable is built using:
- **Electron Builder**: Creates Windows installer
- **NSIS**: Windows installer framework
- **Auto-updater**: Built-in update mechanism

### Build Commands
```bash
# Development build
npm run build

# Production installer
npm run dist:win

# All platforms
npm run dist
```

## 📋 Release Checklist

Before each release:
- [ ] Update version in `package.json`
- [ ] Update `CHANGELOG.md`
- [ ] Test installer on clean Windows VM
- [ ] Verify all features work
- [ ] Check file size is reasonable
- [ ] Test uninstall process
- [ ] Create GitHub release with installer

## 🛠️ Troubleshooting

### Installer Issues
- **"Windows protected your PC"**: Click "More info" → "Run anyway"
- **Antivirus blocking**: Add exception for installer
- **Permission denied**: Run as administrator

### Runtime Issues
- **Hotkeys not working**: Check for conflicts with other apps
- **Text selection issues**: Try different applications
- **Startup not working**: Check Windows startup settings

## 📊 File Structure

```
dist-electron/
├── SnipSearch Setup 1.0.0.exe    # Main installer
├── SnipSearch Setup 1.0.0.exe.blockmap  # Update verification
├── latest.yml                     # Auto-updater manifest
├── win-unpacked/                  # Unpacked application
└── builder-effective-config.yaml  # Build configuration
```

## 🔄 Auto-Updates

SnipSearch includes automatic update functionality:
- Checks for updates on startup
- Downloads and installs updates automatically
- Preserves user settings during updates
- Rollback capability if issues occur

## 📞 Support

For installation or usage issues:
- Check the [README.md](README.md) for setup instructions
- Review [troubleshooting section](README.md#troubleshooting)
- Create an issue on GitHub for bugs
- Join discussions for help and questions 