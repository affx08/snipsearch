import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, Container } from '@mui/material';
import Home from './components/Home';
import ToastHUD from './components/ToastHUD';
import FloatingNav from './components/FloatingNav';
import Settings from './components/Settings';

interface AppProps {
  mode: 'light' | 'dark';
  setMode: (mode: 'light' | 'dark') => void;
}

interface SearchEngine {
  id: string;
  name: string;
  url: string;
  hotkey: string;
}

interface AppSettings {
  darkMode: boolean;
  runOnStartup: boolean;
}

const App: React.FC<AppProps> = ({ mode, setMode }) => {
  const [currentPage, setCurrentPage] = useState<'home' | 'settings'>('home');
  const [searchEngines, setSearchEngines] = useState<SearchEngine[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    darkMode: false,
    runOnStartup: false,
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Initialize data from main process
  useEffect(() => {
    // Get search engines
    if (window.electronAPI) {
      window.electronAPI.getSearchEngines();
      window.electronAPI.onSearchEnginesUpdated((engines: SearchEngine[]) => {
        setSearchEngines(engines);
      });

      // Get settings
      window.electronAPI.getSettings();
      window.electronAPI.onSettingsUpdated((newSettings: AppSettings) => {
        setSettings(newSettings);
        setMode(newSettings.darkMode ? 'dark' : 'light');
      });

      // Listen for new snip dialog
      window.electronAPI.onOpenNewSnipDialog(() => {
        setCurrentPage('home');
        // Trigger new snip dialog in Home component
        window.dispatchEvent(new CustomEvent('openNewSnipDialog'));
      });
    }
  }, [setMode]);

  const handlePageChange = (page: 'home' | 'settings') => {
    setCurrentPage(page);
  };

  const handleAddSearchEngine = (engine: SearchEngine) => {
    if (window.electronAPI) {
      window.electronAPI.addSearchEngine(engine);
    }
  };

  const handleUpdateSearchEngine = (engine: SearchEngine) => {
    if (window.electronAPI) {
      window.electronAPI.updateSearchEngine(engine);
    }
  };

  const handleDeleteSearchEngine = (engineId: string) => {
    if (window.electronAPI) {
      window.electronAPI.deleteSearchEngine(engineId);
    }
  };

  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    if (window.electronAPI) {
      window.electronAPI.updateSettings(updatedSettings);
    }
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* App Bar */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          background: 'transparent',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
            SnipSearch
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          flex: 1, 
          py: 3,
          overflow: 'auto'
        }}
      >
        {currentPage === 'home' && (
          <Home
            searchEngines={searchEngines}
            onAddSearchEngine={handleAddSearchEngine}
            onUpdateSearchEngine={handleUpdateSearchEngine}
            onDeleteSearchEngine={handleDeleteSearchEngine}
            showToastMessage={showToastMessage}
          />
        )}
        {currentPage === 'settings' && (
          <Settings
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            mode={mode}
            setMode={setMode}
          />
        )}
      </Container>

      {/* Floating Navigation */}
      <FloatingNav
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {/* Toast HUD */}
      <ToastHUD
        open={showToast}
        message={toastMessage}
        onClose={() => setShowToast(false)}
      />
    </Box>
  );
};

export default App; 