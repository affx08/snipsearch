declare global {
  interface Window {
    electronAPI: {
      getSearchEngines: () => void;
      addSearchEngine: (engine: any) => void;
      updateSearchEngine: (engine: any) => void;
      deleteSearchEngine: (engineId: string) => void;
      getSettings: () => void;
      updateSettings: (settings: any) => void;
      onSearchEnginesUpdated: (callback: (engines: any[]) => void) => void;
      onSettingsUpdated: (callback: (settings: any) => void) => void;
      onOpenNewSnipDialog: (callback: () => void) => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}

export {}; 