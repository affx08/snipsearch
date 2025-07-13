# SnipSearch Keyboard Shortcuts Test Guide

## How the Fixed Version Works

The keyboard shortcuts now work with a **simpler and more reliable approach**:

### What Changed:
1. **Removed problematic dependencies**: 
   - `node-key-sender` (required Java JAR files)
   - `node-notifier` (caused packaging issues)
   - `robotjs` (required Visual Studio build tools)

2. **Simplified approach**:
   - Instead of trying to simulate Ctrl+C, the app now reads the **current clipboard content**
   - This is more reliable and doesn't require external dependencies

### How to Test the Keyboard Shortcuts:

1. **Install the app**: Run `SnipSearch Setup 1.0.0.exe` from `dist-electron/`

2. **Launch SnipSearch**: Use the desktop shortcut or start menu

3. **Add a search engine**:
   - Click "Add Search Engine"
   - Name: "Google"
   - URL: `https://www.google.com/search?q={query}`
   - Hotkey: `Ctrl+Shift+G` (or any key combination you prefer)

4. **Test the hotkey**:
   - Select some text anywhere (browser, notepad, etc.)
   - **Copy the text** (Ctrl+C)
   - **Press your hotkey** (Ctrl+Shift+G)
   - The app should open Google with your selected text

### Why This Works Better:

- **No external dependencies**: Uses only Electron's built-in clipboard API
- **More reliable**: Doesn't depend on Java or native compilation
- **Simpler workflow**: User copies text manually, then presses hotkey
- **Better error handling**: Clear notifications when no text is selected

### Expected Behavior:

✅ **When text is copied**: Hotkey opens search with the copied text
✅ **When no text is copied**: Shows notification asking to copy text first
✅ **Global hotkeys**: Work even when other apps are focused
✅ **Notifications**: Uses Electron's built-in notification system

### Troubleshooting:

- If hotkeys don't work, check that the app is running in the system tray
- Make sure you've copied text to clipboard before pressing the hotkey
- Verify the hotkey combination isn't conflicting with other applications 