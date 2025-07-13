import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  Chip
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Info as InfoIcon,
  Keyboard as KeyboardIcon
} from '@mui/icons-material';

interface Settings {
  darkMode: boolean;
  runOnStartup: boolean;
}

interface SettingsProps {
  settings: Settings;
  onUpdateSettings: (settings: Partial<Settings>) => void;
  mode: 'light' | 'dark';
  setMode: (mode: 'light' | 'dark') => void;
}

const Settings: React.FC<SettingsProps> = ({
  settings,
  onUpdateSettings,
  mode,
  setMode
}) => {
  const handleDarkModeToggle = (checked: boolean) => {
    onUpdateSettings({ darkMode: checked });
    setMode(checked ? 'dark' : 'light');
  };

  const handleStartupToggle = (checked: boolean) => {
    onUpdateSettings({ runOnStartup: checked });
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Customize your SnipSearch experience
        </Typography>
      </Box>

      {/* Settings Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Appearance Settings */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
              Appearance
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.darkMode}
                  onChange={(e) => handleDarkModeToggle(e.target.checked)}
                  color="primary"
                />
              }
              label="Dark Mode"
              sx={{ mt: 2 }}
            />
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Automatically syncs with your Windows system theme
            </Typography>
          </CardContent>
        </Card>

        {/* Startup Settings */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon />
              Startup Behavior
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.runOnStartup}
                  onChange={(e) => handleStartupToggle(e.target.checked)}
                  color="primary"
                />
              }
              label="Run on Windows Startup"
              sx={{ mt: 2 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Automatically launch SnipSearch when Windows starts
            </Typography>
          </CardContent>
        </Card>

        {/* Usage Instructions */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <KeyboardIcon />
              How to Use
            </Typography>
            <List sx={{ mt: 2 }}>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <Chip label="1" size="small" color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Select any text on your screen"
                  secondary="Highlight the text you want to search"
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <Chip label="2" size="small" color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Press your custom hotkey"
                  secondary="Use the keyboard shortcut you configured"
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <Chip label="3" size="small" color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Search automatically opens"
                  secondary="Your browser opens with the search results"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon />
              Tips & Tricks
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Pro tip:</strong> You can use the system tray icon to quickly access SnipSearch or create new search engines.
              </Typography>
            </Alert>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Supported URL placeholders:</strong>
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                <Chip label="{query}" size="small" variant="outlined" />
                <Chip label="Required" size="small" color="primary" />
              </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Example URLs:</strong>
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                <Typography variant="caption" fontFamily="monospace">
                  {'https://www.google.com/search?q={query}'}
                </Typography>
                <Typography variant="caption" fontFamily="monospace">
                  {'https://www.youtube.com/results?search_query={query}'}
                </Typography>
                <Typography variant="caption" fontFamily="monospace">
                  {'https://github.com/search?q={query}'}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Settings; 