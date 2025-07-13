import { app, BrowserWindow, Tray, Menu, nativeImage, globalShortcut, clipboard, shell, dialog, systemPreferences, Notification } from 'electron';
import * as path from 'path';
import ElectronStore from 'electron-store';
import * as regedit from 'regedit';
const regeditPromisified = regedit.promisified;
import * as net from 'net';
import * as activeWin from 'active-win';

const store = new ElectronStore();

interface SearchEngine {
  id: string;
  name: string;
  url: string;
  hotkey: string;
}

class SnipSearchApp {
  private mainWindow: BrowserWindow | null = null;
  private tray: Tray | null = null;
  private searchEngines: SearchEngine[] = [];

  constructor() {
    app.whenReady().then(() => this.initializeApp());
  }

  private async initializeApp() {
    await this.createWindow();
    this.setupTray();
    this.loadSearchEngines();
    this.registerGlobalHotkeys();
    this.setupStartupBehavior();
    this.setupAccentColorListener();
   
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', async () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        await this.createWindow();
      }
    });

    app.on('before-quit', () => {
      this.unregisterGlobalHotkeys();
    });
  }

  private async createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      },
      titleBarStyle: 'hidden',
      titleBarOverlay: {
        color: '#1C1B1F', // Match dark mode background
        symbolColor: '#FFFFFF',
        height: 32
      },
      icon: path.join(__dirname, '../assets/icon.png'),
      show: false
    });

    // Robust dev/prod detection
    const isDev = process.env.NODE_ENV === 'development' || process.env.VITE_DEV_SERVER_URL;
    if (isDev) {
      // Try to find the correct Vite dev server port
      let devURL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:3000/';
      
      // If no explicit URL, try to find the correct port
      if (!process.env.VITE_DEV_SERVER_URL) {
        for (let port = 3000; port <= 3010; port++) {
          if (await this.isPortOpen(port)) {
            devURL = `http://localhost:${port}/`;
            break;
          }
        }
      }
      
      console.log('Loading DEV URL:', devURL);
      this.mainWindow.loadURL(devURL);
      this.mainWindow.webContents.openDevTools();
    } else {
      // Find the correct path to index.html in production
      const indexPath = path.join(__dirname, '../dist/index.html');
      console.log('Loading PROD file:', indexPath);
      this.mainWindow.loadFile(indexPath);
    }

    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    // Handle IPC messages
    this.setupIPC();
  }

  private setupIPC() {
    if (!this.mainWindow) return;

    // Handle search engine operations
    this.mainWindow.webContents.on('ipc-message', (event, channel, ...args) => {
      switch (channel) {
        case 'get-search-engines':
          this.mainWindow?.webContents.send('search-engines-updated', this.searchEngines);
          break;
        case 'add-search-engine':
          this.addSearchEngine(args[0]);
          break;
        case 'update-search-engine':
          this.updateSearchEngine(args[0]);
          break;
        case 'delete-search-engine':
          this.deleteSearchEngine(args[0]);
          break;
        case 'get-settings':
          this.mainWindow?.webContents.send('settings-updated', {
            darkMode: store.get('darkMode', false),
            runOnStartup: store.get('runOnStartup', false)
          });
          break;
        case 'update-settings':
          this.updateSettings(args[0]);
          break;
        case 'get-accent-color':
          this.getAccentColor();
          break;
      }
    });
  }

  private setupTray() {
    const iconPath = path.join(__dirname, '../assets/icon.png');
    const icon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
    
    this.tray = new Tray(icon);
    this.tray.setToolTip('SnipSearch');

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'New Snip',
        click: () => {
          this.showWindow();
          this.mainWindow?.webContents.send('open-new-snip-dialog');
        }
      },
      { type: 'separator' },
      {
        label: 'Toggle Dark Mode',
        click: () => {
          const currentMode = store.get('darkMode', false);
          store.set('darkMode', !currentMode);
          this.mainWindow?.webContents.send('settings-updated', {
            darkMode: !currentMode,
            runOnStartup: store.get('runOnStartup', false)
          });
        }
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          app.quit();
        }
      }
    ]);

    this.tray.setContextMenu(contextMenu);
    this.tray.on('double-click', () => {
      this.showWindow();
    });
  }

  private showWindow() {
    if (this.mainWindow) {
      if (this.mainWindow.isMinimized()) {
        this.mainWindow.restore();
      }
      this.mainWindow.show();
      this.mainWindow.focus();
    }
  }

  private loadSearchEngines() {
    this.searchEngines = store.get('searchEngines', []) as SearchEngine[];
  }

  private saveSearchEngines() {
    store.set('searchEngines', this.searchEngines);
  }

  private addSearchEngine(engine: SearchEngine) {
    this.searchEngines.push(engine);
    this.saveSearchEngines();
    this.registerGlobalHotkeys();
    this.mainWindow?.webContents.send('search-engines-updated', this.searchEngines);
  }

  private updateSearchEngine(engine: SearchEngine) {
    const index = this.searchEngines.findIndex(e => e.id === engine.id);
    if (index !== -1) {
      this.searchEngines[index] = engine;
      this.saveSearchEngines();
      this.registerGlobalHotkeys();
      this.mainWindow?.webContents.send('search-engines-updated', this.searchEngines);
    }
  }

  private deleteSearchEngine(engineId: string) {
    this.searchEngines = this.searchEngines.filter(e => e.id !== engineId);
    this.saveSearchEngines();
    this.registerGlobalHotkeys();
    this.mainWindow?.webContents.send('search-engines-updated', this.searchEngines);
  }

  private registerGlobalHotkeys() {
    this.unregisterGlobalHotkeys();
    
    this.searchEngines.forEach(engine => {
      try {
        const success = globalShortcut.register(engine.hotkey, () => {
          this.performSearch(engine);
        });
        
        if (!success) {
          console.warn(`Failed to register hotkey: ${engine.hotkey}`);
        }
      } catch (error) {
        console.error(`Error registering hotkey ${engine.hotkey}:`, error);
      }
    });
  }

  private unregisterGlobalHotkeys() {
    globalShortcut.unregisterAll();
  }

  private async performSearch(engine: SearchEngine) {
    try {
      // Save current clipboard content
      const originalClipboard = clipboard.readText();
      console.log('Original clipboard:', originalClipboard ? `"${originalClipboard}"` : 'empty');

      // Try multiple approaches to get selected text
      let selectedText = await this.getSelectedText();
      console.log('Selected text result:', selectedText ? `"${selectedText}"` : 'empty');

      // Restore original clipboard content
      if (originalClipboard) {
        clipboard.writeText(originalClipboard);
      }

      // If no text found, show helpful message
      if (!selectedText || selectedText.trim() === '') {
        this.showToast(
          'No text found', 
          'Copy text (Ctrl+C) first, then use the hotkey. Or select text and copy it manually.'
        );
        return;
      }

      // Create search URL
      const searchUrl = engine.url.replace('{query}', encodeURIComponent(selectedText.trim()));
      this.showToast(`Searching ${engine.name}`, `Searching for: ${selectedText.trim()}`);
      await shell.openExternal(searchUrl);
    } catch (error) {
      console.error('Error performing search:', error);
      this.showToast('Search Error', 'Failed to perform search. Please try copying text manually first.');
    }
  }

  private async getSelectedText(): Promise<string> {
    try {
      // Get current clipboard content
      const clipboardText = clipboard.readText();
      console.log('Current clipboard content:', clipboardText ? `"${clipboardText}"` : 'empty');
      
      // If there's text in the clipboard, use it (user might have copied it manually)
      if (clipboardText && clipboardText.trim() !== '' && clipboardText.length < 1000) {
        console.log('Using clipboard content:', clipboardText);
        return clipboardText;
      }

      // If no clipboard content, try the AutoHotkey-style method as a last resort
      console.log('No clipboard content, trying AutoHotkey-style method...');
      const ahkText = await this.tryAutoHotkeyStyle();
      if (ahkText && ahkText.trim() !== '') {
        console.log('AutoHotkey-style found text:', ahkText);
        return ahkText;
      }
      console.log('AutoHotkey-style method failed');

      console.log('=== No text found ===');
      return '';
    } catch (error) {
      console.error('Error getting selected text:', error);
      return '';
    }
  }

  private async tryAutoHotkeyStyle(): Promise<string> {
    try {
      console.log('AutoHotkey-style: Starting...');
      const { exec } = require('child_process');
      const util = require('util');
      const execAsync = util.promisify(exec);

      // Use AutoHotkey-style approach: empty clipboard, send Ctrl+C, wait for update
      const script = `
        Add-Type -AssemblyName System.Windows.Forms
        Add-Type -AssemblyName System.Runtime.InteropServices
        
        # Import required Windows API functions
        $signature = @"
          [DllImport("user32.dll")]
          public static extern IntPtr GetForegroundWindow();
          
          [DllImport("user32.dll")]
          public static extern bool SetForegroundWindow(IntPtr hWnd);
          
          [DllImport("user32.dll")]
          public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
"@
        
        $Win32 = Add-Type -memberDefinition $signature -name "Win32" -namespace Win32Functions -passThru
        
        # Constants
        $SW_RESTORE = 9
        
        # Get the foreground window and ensure it's active
        $hwnd = $Win32::GetForegroundWindow()
        
        if ($hwnd -ne [IntPtr]::Zero) {
          # Ensure the window is visible and active
          $Win32::ShowWindow($hwnd, $SW_RESTORE)
          $Win32::SetForegroundWindow($hwnd)
          
          # Wait a moment for the window to be ready
          Start-Sleep -Milliseconds 100
          
          # Use SendKeys to send Ctrl+C (more reliable than PostMessage)
          [System.Windows.Forms.SendKeys]::SendWait("^c")
          
          # Wait for clipboard update
          Start-Sleep -Milliseconds 200
        }
      `;
      
      console.log('AutoHotkey-style: Clearing clipboard...');
      // First, empty the clipboard
      clipboard.clear();
      
      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('AutoHotkey-style: Sending Ctrl+C...');
      // Send Ctrl+C
      await execAsync(`powershell -Command "${script}"`);
      
      console.log('AutoHotkey-style: Waiting for clipboard update...');
      // Wait for clipboard to update (like ClipWait in AutoHotkey)
      let attempts = 0;
      let newClipboard = '';
      
      while (attempts < 20) { // Wait up to 2 seconds (20 * 100ms)
        await new Promise(resolve => setTimeout(resolve, 100));
        newClipboard = clipboard.readText();
        
        console.log(`AutoHotkey-style: Attempt ${attempts + 1}, clipboard length: ${newClipboard.length}`);
        
        if (newClipboard && newClipboard.trim() !== '') {
          console.log('AutoHotkey-style captured text:', newClipboard);
          return newClipboard;
        }
        
        attempts++;
      }
      
      console.log('AutoHotkey-style: No text captured after 20 attempts');
      return '';
    } catch (error) {
      console.error('Error in tryAutoHotkeyStyle:', error);
      return '';
    }
  }

  private async tryAccessibilityAPI(): Promise<string> {
    try {
      const { exec } = require('child_process');
      const util = require('util');
      const execAsync = util.promisify(exec);

      // Use Windows API to get selected text directly
      const script = `
        Add-Type -TypeDefinition @"
          using System;
          using System.Runtime.InteropServices;
          using System.Text;
          using System.Windows.Forms;
          
          public class Win32 {
            [DllImport("user32.dll")]
            public static extern IntPtr GetForegroundWindow();
            
            [DllImport("user32.dll")]
            public static extern IntPtr GetFocus();
            
            [DllImport("user32.dll")]
            public static extern int SendMessage(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam);
            
            [DllImport("user32.dll")]
            public static extern int SendMessage(IntPtr hWnd, uint Msg, IntPtr wParam, StringBuilder lParam);
            
            [DllImport("user32.dll")]
            public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);
            
            [DllImport("user32.dll")]
            public static extern bool SetForegroundWindow(IntPtr hWnd);
            
            public const uint WM_GETTEXT = 0x000D;
            public const uint WM_GETTEXTLENGTH = 0x000E;
            public const uint EM_GETSEL = 0x00B0;
            public const uint EM_GETSELTEXT = 0x00B1;
            public const uint WM_COPY = 0x0301;
          }
"@
        
        try {
          # Get the foreground window
          $hwnd = [Win32]::GetForegroundWindow()
          $focusHwnd = [Win32]::GetFocus()
          
          if ($hwnd -ne [IntPtr]::Zero) {
            # Ensure the window is active
            [Win32]::SetForegroundWindow($hwnd)
            Start-Sleep -Milliseconds 100
            
            # Try to get text from focused control
            if ($focusHwnd -ne [IntPtr]::Zero) {
              # Try to send WM_COPY message directly
              $result = [Win32]::SendMessage($focusHwnd, [Win32]::WM_COPY, [IntPtr]::Zero, [IntPtr]::Zero)
              if ($result -eq 0) {
                # If WM_COPY failed, try to get text length and content
                $length = [Win32]::SendMessage($focusHwnd, [Win32]::WM_GETTEXTLENGTH, [IntPtr]::Zero, [IntPtr]::Zero)
                if ($length -gt 0) {
                  $text = New-Object System.Text.StringBuilder($length + 1)
                  $result = [Win32]::SendMessage($focusHwnd, [Win32]::WM_GETTEXT, [IntPtr]($length + 1), $text)
                  if ($result -gt 0) {
                    return $text.ToString()
                  }
                }
              }
            }
            
            # Try to get window title as fallback
            $title = New-Object System.Text.StringBuilder(256)
            $result = [Win32]::GetWindowText($hwnd, $title, 256)
            if ($result -gt 0) {
              return $title.ToString()
            }
          }
        } catch {
          Write-Host "API error: $($_.Exception.Message)"
        }
        
        return ""
      `;
      
      const result = await execAsync(`powershell -Command "${script}"`);
      const text = result.stdout.trim();
      
      if (text && text !== '') {
        return text;
      }
      
      return '';
    } catch (error) {
      console.error('Error in tryAccessibilityAPI:', error);
      return '';
    }
  }

  private async trySimulateCopy(): Promise<string> {
    try {
      const { exec } = require('child_process');
      const util = require('util');
      const execAsync = util.promisify(exec);

      // Use a more robust PowerShell script with better timing
      const script = `
        Add-Type -AssemblyName System.Windows.Forms
        Add-Type -AssemblyName System.Runtime.InteropServices
        
        # Get the foreground window
        $signature = '[DllImport("user32.dll")]public static extern IntPtr GetForegroundWindow();'
        $GetForegroundWindow = Add-Type -memberDefinition $signature -name "Win32GetForegroundWindow" -namespace Win32Functions -passThru
        
        # Send Ctrl+C to the active window with multiple attempts
        for ($i = 0; $i -lt 3; $i++) {
          [System.Windows.Forms.SendKeys]::SendWait('^c')
          Start-Sleep -Milliseconds 100
        }
        
        # Wait a bit for the clipboard to update
        Start-Sleep -Milliseconds 300
      `;
      
      await execAsync(`powershell -Command "${script}"`);
      
      // Wait for clipboard to update
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const newClipboard = clipboard.readText();
      console.log('trySimulateCopy result:', newClipboard ? `"${newClipboard}"` : 'empty');
      return newClipboard;
    } catch (error) {
      console.error('Error in trySimulateCopy:', error);
      return '';
    }
  }

  private async tryWindowsAPICopy(): Promise<string> {
    try {
      const { exec } = require('child_process');
      const util = require('util');
      const execAsync = util.promisify(exec);

      // Use a more sophisticated approach with Windows API
      const script = `
        Add-Type -AssemblyName System.Windows.Forms
        Add-Type -AssemblyName System.Runtime.InteropServices
        
        # Import required Windows API functions
        $signature = @"
          [DllImport("user32.dll")]
          public static extern IntPtr GetForegroundWindow();
          
          [DllImport("user32.dll")]
          public static extern bool SetForegroundWindow(IntPtr hWnd);
          
          [DllImport("user32.dll")]
          public static extern bool PostMessage(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam);
          
          [DllImport("user32.dll")]
          public static extern bool SendMessage(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam);
"@
        
        $Win32 = Add-Type -memberDefinition $signature -name "Win32" -namespace Win32Functions -passThru
        
        # Constants
        $WM_KEYDOWN = 0x0100
        $WM_KEYUP = 0x0101
        $VK_CONTROL = 0x11
        $VK_C = 0x43
        
        # Get the foreground window
        $hwnd = $Win32::GetForegroundWindow()
        
        if ($hwnd -ne [IntPtr]::Zero) {
          # Send Ctrl+C combination with multiple attempts
          for ($i = 0; $i -lt 2; $i++) {
            $Win32::PostMessage($hwnd, $WM_KEYDOWN, [IntPtr]$VK_CONTROL, [IntPtr]::Zero)
            Start-Sleep -Milliseconds 50
            $Win32::PostMessage($hwnd, $WM_KEYDOWN, [IntPtr]$VK_C, [IntPtr]::Zero)
            Start-Sleep -Milliseconds 50
            $Win32::PostMessage($hwnd, $WM_KEYUP, [IntPtr]$VK_C, [IntPtr]::Zero)
            Start-Sleep -Milliseconds 50
            $Win32::PostMessage($hwnd, $WM_KEYUP, [IntPtr]$VK_CONTROL, [IntPtr]::Zero)
            Start-Sleep -Milliseconds 100
          }
        }
        
        # Wait for clipboard update
        Start-Sleep -Milliseconds 400
      `;
      
      await execAsync(`powershell -Command "${script}"`);
      
      // Wait for clipboard to update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newClipboard = clipboard.readText();
      console.log('tryWindowsAPICopy result:', newClipboard ? `"${newClipboard}"` : 'empty');
      return newClipboard;
    } catch (error) {
      console.error('Error in tryWindowsAPICopy:', error);
      return '';
    }
  }

  private async tryDirectWindowsAPI(): Promise<string> {
    try {
      const { exec } = require('child_process');
      const util = require('util');
      const execAsync = util.promisify(exec);

      // Try to get selected text directly using Windows API without simulating Ctrl+C
      const script = `
        Add-Type -AssemblyName System.Windows.Forms
        Add-Type -AssemblyName System.Runtime.InteropServices
        
        # Import required Windows API functions
        $signature = @"
          [DllImport("user32.dll")]
          public static extern IntPtr GetForegroundWindow();
          
          [DllImport("user32.dll")]
          public static extern IntPtr GetFocus();
          
          [DllImport("user32.dll")]
          public static extern bool SetForegroundWindow(IntPtr hWnd);
          
          [DllImport("user32.dll")]
          public static extern int SendMessage(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam);
          
          [DllImport("user32.dll")]
          public static extern int SendMessage(IntPtr hWnd, uint Msg, IntPtr wParam, System.Text.StringBuilder lParam);
          
          [DllImport("user32.dll")]
          public static extern int GetWindowText(IntPtr hWnd, System.Text.StringBuilder lpString, int nMaxCount);
          
          public const uint WM_GETTEXT = 0x000D;
          public const uint WM_GETTEXTLENGTH = 0x000E;
          public const uint EM_GETSEL = 0x00B0;
          public const uint EM_GETSELTEXT = 0x00B1;
          public const uint WM_COPY = 0x0301;
        "@
        
        $Win32 = Add-Type -memberDefinition $signature -name "Win32" -namespace Win32Functions -passThru
        
        try {
          # Get the foreground window and focused control
          $hwnd = [Win32]::GetForegroundWindow()
          $focusHwnd = [Win32]::GetFocus()
          
          if ($hwnd -ne [IntPtr]::Zero) {
            # Ensure the window is active
            [Win32]::SetForegroundWindow($hwnd)
            Start-Sleep -Milliseconds 100
            
            # Try to get text from focused control
            if ($focusHwnd -ne [IntPtr]::Zero) {
              # Try to send WM_COPY message directly
              $result = [Win32]::SendMessage($focusHwnd, [Win32]::WM_COPY, [IntPtr]::Zero, [IntPtr]::Zero)
              if ($result -eq 0) {
                # If WM_COPY failed, try to get text length and content
                $length = [Win32]::SendMessage($focusHwnd, [Win32]::WM_GETTEXTLENGTH, [IntPtr]::Zero, [IntPtr]::Zero)
                if ($length -gt 0) {
                  $text = New-Object System.Text.StringBuilder($length + 1)
                  $result = [Win32]::SendMessage($focusHwnd, [Win32]::WM_GETTEXT, [IntPtr]($length + 1), $text)
                  if ($result -gt 0) {
                    return $text.ToString()
                  }
                }
              }
            }
          }
        } catch {
          # If all else fails, try SendKeys as a last resort
          [System.Windows.Forms.SendKeys]::SendWait("^c")
          Start-Sleep -Milliseconds 200
        }
      `;
      
      await execAsync(`powershell -Command "${script}"`);
      
      // Wait for clipboard to update
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newClipboard = clipboard.readText();
      console.log('tryDirectWindowsAPI result:', newClipboard ? `"${newClipboard}"` : 'empty');
      return newClipboard;
    } catch (error) {
      console.error('Error in tryDirectWindowsAPI:', error);
      return '';
    }
  }

  private async tryWindowsAccessibilityAPI(): Promise<string> {
    try {
      const { exec } = require('child_process');
      const util = require('util');
      const execAsync = util.promisify(exec);

      // Use Windows Accessibility API to get selected text
      const script = `
        Add-Type -AssemblyName System.Windows.Forms
        Add-Type -AssemblyName System.Runtime.InteropServices
        Add-Type -AssemblyName UIAutomationClient
        Add-Type -AssemblyName UIAutomationTypes
        
        try {
          # Get the automation element for the foreground window
          $automation = [System.Windows.Automation.AutomationElement]::RootElement
          $foregroundWindow = [System.Windows.Automation.AutomationElement]::FromHandle([System.Windows.Automation.AutomationElement]::RootElement.Current.NativeWindowHandle)
          
          if ($foregroundWindow -ne $null) {
            # Try to get the focused element
            $focusedElement = [System.Windows.Automation.AutomationElement]::FocusedElement
            
            if ($focusedElement -ne $null) {
              # Try to get the text pattern
              $textPattern = $focusedElement.GetCurrentPattern([System.Windows.Automation.TextPattern]::Pattern)
              
              if ($textPattern -ne $null) {
                # Get the text range for the selection
                $selection = $textPattern.GetSelection()
                
                if ($selection -ne $null -and $selection.Length -gt 0) {
                  return $selection.GetText(-1)
                }
              }
            }
          }
        } catch {
          Write-Host "Accessibility API failed: $($_.Exception.Message)"
        }
      `;
      
      const result = await execAsync(`powershell -Command "${script}"`);
      console.log('tryWindowsAccessibilityAPI result:', result.stdout ? `"${result.stdout.trim()}"` : 'empty');
      return result.stdout ? result.stdout.trim() : '';
    } catch (error) {
      console.error('Error in tryWindowsAccessibilityAPI:', error);
      return '';
    }
  }

  private async tryWindowsUIAutomationAPI(): Promise<string> {
    try {
      const { exec } = require('child_process');
      const util = require('util');
      const execAsync = util.promisify(exec);

      // Use Windows UI Automation API to get selected text
      const script = `
        Add-Type -AssemblyName System.Windows.Forms
        Add-Type -AssemblyName System.Runtime.InteropServices
        
        # Import required Windows API functions
        $signature = @"
          [DllImport("user32.dll")]
          public static extern IntPtr GetForegroundWindow();
          
          [DllImport("user32.dll")]
          public static extern IntPtr GetFocus();
          
          [DllImport("user32.dll")]
          public static extern bool SetForegroundWindow(IntPtr hWnd);
          
          [DllImport("user32.dll")]
          public static extern int SendMessage(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam);
          
          [DllImport("user32.dll")]
          public static extern int SendMessage(IntPtr hWnd, uint Msg, IntPtr wParam, System.Text.StringBuilder lParam);
          
          public const uint WM_GETTEXT = 0x000D;
          public const uint WM_GETTEXTLENGTH = 0x000E;
          public const uint EM_GETSEL = 0x00B0;
          public const uint EM_GETSELTEXT = 0x00B1;
          public const uint WM_COPY = 0x0301;
        "@
        
        $Win32 = Add-Type -memberDefinition $signature -name "Win32" -namespace Win32Functions -passThru
        
        try {
          # Get the foreground window and focused control
          $hwnd = [Win32]::GetForegroundWindow()
          $focusHwnd = [Win32]::GetFocus()
          
          if ($hwnd -ne [IntPtr]::Zero) {
            # Ensure the window is active
            [Win32]::SetForegroundWindow($hwnd)
            Start-Sleep -Milliseconds 100
            
            # Try to get text from focused control
            if ($focusHwnd -ne [IntPtr]::Zero) {
              # Try to get text length and content
              $length = [Win32]::SendMessage($focusHwnd, [Win32]::WM_GETTEXTLENGTH, [IntPtr]::Zero, [IntPtr]::Zero)
              if ($length -gt 0) {
                $text = New-Object System.Text.StringBuilder($length + 1)
                $result = [Win32]::SendMessage($focusHwnd, [Win32]::WM_GETTEXT, [IntPtr]($length + 1), $text)
                if ($result -gt 0) {
                  return $text.ToString()
                }
              }
            }
          }
        } catch {
          Write-Host "UI Automation API failed: $($_.Exception.Message)"
        }
      `;
      
      const result = await execAsync(`powershell -Command "${script}"`);
      console.log('tryWindowsUIAutomationAPI result:', result.stdout ? `"${result.stdout.trim()}"` : 'empty');
      return result.stdout ? result.stdout.trim() : '';
    } catch (error) {
      console.error('Error in tryWindowsUIAutomationAPI:', error);
      return '';
    }
  }

  private async tryWindowsAPIFocusedControl(): Promise<string> {
    try {
      const { exec } = require('child_process');
      const util = require('util');
      const execAsync = util.promisify(exec);

      // Use Windows API to get text from the focused control
      const script = `
        Add-Type -AssemblyName System.Windows.Forms
        Add-Type -AssemblyName System.Runtime.InteropServices
        
        # Import required Windows API functions
        $signature = @"
          [DllImport("user32.dll")]
          public static extern IntPtr GetForegroundWindow();
          
          [DllImport("user32.dll")]
          public static extern IntPtr GetFocus();
          
          [DllImport("user32.dll")]
          public static extern bool SetForegroundWindow(IntPtr hWnd);
          
          [DllImport("user32.dll")]
          public static extern int SendMessage(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam);
          
          [DllImport("user32.dll")]
          public static extern int SendMessage(IntPtr hWnd, uint Msg, IntPtr wParam, System.Text.StringBuilder lParam);
          
          [DllImport("user32.dll")]
          public static extern int GetWindowText(IntPtr hWnd, System.Text.StringBuilder lpString, int nMaxCount);
          
          public const uint WM_GETTEXT = 0x000D;
          public const uint WM_GETTEXTLENGTH = 0x000E;
          public const uint EM_GETSEL = 0x00B0;
          public const uint EM_GETSELTEXT = 0x00B1;
          public const uint WM_COPY = 0x0301;
        "@
        
        $Win32 = Add-Type -memberDefinition $signature -name "Win32" -namespace Win32Functions -passThru
        
        try {
          # Get the focused control
          $focusHwnd = [Win32]::GetFocus()
          
          if ($focusHwnd -ne [IntPtr]::Zero) {
            # Try to get text from the focused control
            $length = [Win32]::SendMessage($focusHwnd, [Win32]::WM_GETTEXTLENGTH, [IntPtr]::Zero, [IntPtr]::Zero)
            if ($length -gt 0) {
              $text = New-Object System.Text.StringBuilder($length + 1)
              $result = [Win32]::SendMessage($focusHwnd, [Win32]::WM_GETTEXT, [IntPtr]($length + 1), $text)
              if ($result -gt 0) {
                return $text.ToString()
              }
            }
          }
        } catch {
          Write-Host "Focused control API failed: $($_.Exception.Message)"
        }
      `;
      
      const result = await execAsync(`powershell -Command "${script}"`);
      console.log('tryWindowsAPIFocusedControl result:', result.stdout ? `"${result.stdout.trim()}"` : 'empty');
      return result.stdout ? result.stdout.trim() : '';
    } catch (error) {
      console.error('Error in tryWindowsAPIFocusedControl:', error);
      return '';
    }
  }

  private showToast(title: string, message: string) {
    if (Notification.isSupported()) {
      const notification = new Notification({
        title: title,
        body: message,
        icon: path.join(__dirname, '../assets/icon.png'),
        silent: true
      });
      notification.show();
      // Auto-hide after 2 seconds
      setTimeout(() => {
        notification.close();
      }, 2000);
    } else {
      // Fallback to console log if notifications not supported
      console.log(`${title}: ${message}`);
    }
  }

  private async setupStartupBehavior() {
    const runOnStartup = store.get('runOnStartup', false) as boolean;
    await this.setStartupBehavior(runOnStartup);
  }

  private async setStartupBehavior(enable: boolean) {
    try {
      const key = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run';
      const appName = 'SnipSearch';
      const appPath = `"${app.getPath('exe')}"`;
      
      if (enable) {
        await regeditPromisified.putValue(key, { [appName]: { value: appPath, type: 'REG_SZ' } });
      } else {
        try {
          // Try to use deleteValue if it exists
          if (regeditPromisified.deleteValue && typeof regeditPromisified.deleteValue === 'function') {
            await regeditPromisified.deleteValue(key, appName);
          } else {
            // Fallback: set the value to empty string to effectively remove it
            await regeditPromisified.putValue(key, { [appName]: { value: '', type: 'REG_SZ' } });
          }
        } catch (deleteError) {
          console.warn('Could not remove startup entry:', deleteError);
        }
      }
    } catch (error) {
      console.error('Error setting startup behavior:', error);
    }
  }

  // Helper to check if a port is open
  private async isPortOpen(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(300);
      socket.once('connect', () => {
        socket.destroy();
        resolve(true);
      });
      socket.once('timeout', () => {
        socket.destroy();
        resolve(false);
      });
      socket.once('error', () => {
        resolve(false);
      });
      socket.connect(port, '127.0.0.1');
    });
  }

  private updateSettings(settings: { darkMode?: boolean; runOnStartup?: boolean }) {
    if (settings.darkMode !== undefined) {
      store.set('darkMode', settings.darkMode);
    }
    
    if (settings.runOnStartup !== undefined) {
      store.set('runOnStartup', settings.runOnStartup);
      this.setStartupBehavior(settings.runOnStartup);
    }
  }

  private getAccentColor() {
    try {
      const accentColor = systemPreferences.getAccentColor();
      console.log('Windows accent color:', accentColor);
      this.mainWindow?.webContents.send('accent-color-updated', accentColor);
    } catch (error) {
      console.error('Error getting accent color:', error);
      // Fallback to default Material 3 primary
      this.mainWindow?.webContents.send('accent-color-updated', '#6750A4');
    }
  }

  private setupAccentColorListener() {
    // Only set up listener on Windows
    if (process.platform === 'win32') {
      systemPreferences.on('accent-color-changed', () => {
        this.getAccentColor();
      });
    }
  }
}

new SnipSearchApp(); 