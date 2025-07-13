import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Search engine operations
  getSearchEngines: () => ipcRenderer.send('get-search-engines'),
  addSearchEngine: (engine: any) => ipcRenderer.send('add-search-engine', engine),
  updateSearchEngine: (engine: any) => ipcRenderer.send('update-search-engine', engine),
  deleteSearchEngine: (engineId: string) => ipcRenderer.send('delete-search-engine', engineId),
  
  // Settings operations
  getSettings: () => ipcRenderer.send('get-settings'),
  updateSettings: (settings: any) => ipcRenderer.send('update-settings', settings),
  
  // Accent color operations
  getAccentColor: () => ipcRenderer.send('get-accent-color'),
  
  // Event listeners
  onSearchEnginesUpdated: (callback: (engines: any[]) => void) => {
    ipcRenderer.on('search-engines-updated', (_, engines) => callback(engines));
  },
  
  onSettingsUpdated: (callback: (settings: any) => void) => {
    ipcRenderer.on('settings-updated', (_, settings) => callback(settings));
  },
  
  onOpenNewSnipDialog: (callback: () => void) => {
    ipcRenderer.on('open-new-snip-dialog', () => callback());
  },
  
  onAccentColorUpdated: (callback: (accentColor: string) => void) => {
    ipcRenderer.on('accent-color-updated', (_, accentColor) => callback(accentColor));
  },
  
  // Remove listeners
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  }
}); 