import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import './index.css';

// Type declarations for Electron API
declare global {
  interface Window {
    electronAPI: {
      getSearchEngines: () => void;
      addSearchEngine: (engine: any) => void;
      updateSearchEngine: (engine: any) => void;
      deleteSearchEngine: (engineId: string) => void;
      getSettings: () => void;
      updateSettings: (settings: any) => void;
      getAccentColor: () => void;
      onSearchEnginesUpdated: (callback: (engines: any[]) => void) => void;
      onSettingsUpdated: (callback: (settings: any) => void) => void;
      onOpenNewSnipDialog: (callback: () => void) => void;
      onAccentColorUpdated: (callback: (accentColor: string) => void) => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}

// Utility: Convert Electron BGR hex to #RRGGBB
function electronAccentToHex(accent: string): string {
  // Electron returns BGR(A) hex, e.g. 'dc0043e3'
  // We want '#RRGGBB'
  if (!accent || accent.length < 6) return '#6750A4';
  const b = accent.slice(0, 2);
  const g = accent.slice(2, 4);
  const r = accent.slice(4, 6);
  return `#${r}${g}${b}`;
}

// Windows theme detection
const getSystemTheme = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

// Material 3 Expressive Color Palette
const MATERIAL_3_EXPRESSIVE_COLORS = {
  light: {
    // Primary colors (Expressive)
    primary: {
      main: '#6750A4', // Primary 40
      light: '#8B7CC8', // Primary 80
      dark: '#4F378B', // Primary 20
      contrastText: '#FFFFFF',
    },
    // Secondary colors (Expressive)
    secondary: {
      main: '#625B71', // Secondary 40
      light: '#7C7C7C', // Secondary 80
      dark: '#49454F', // Secondary 20
      contrastText: '#FFFFFF',
    },
    // Error colors (Expressive)
    error: {
      main: '#BA1A1A', // Error 40
      light: '#FFB4AB', // Error 80
      dark: '#8C1D18', // Error 20
      contrastText: '#FFFFFF',
    },
    // Background colors (Expressive)
    background: {
      default: '#FFFBFE',
      paper: '#FFFBFE',
      container: '#F3EDF7',
      containerHigh: '#E7E0EC',
      containerHighest: '#E7E0EC',
    },
    // Text colors (Expressive)
    text: {
      primary: '#1C1B1F',
      secondary: '#49454F',
      disabled: '#CAC4D0',
    },
    // Outline colors (Expressive)
    outline: {
      main: '#79747E',
      variant: '#CAC4D0',
    },
  },
  dark: {
    // Primary colors (Expressive)
    primary: {
      main: '#D0BCFF', // Primary 80
      light: '#E8DEF8', // Primary 90
      dark: '#B69DF8', // Primary 70
      contrastText: '#1C1B1F',
    },
    // Secondary colors (Expressive)
    secondary: {
      main: '#CCC2DC', // Secondary 80
      light: '#E8DEF8', // Secondary 90
      dark: '#B69DF8', // Secondary 70
      contrastText: '#1C1B1F',
    },
    // Error colors (Expressive)
    error: {
      main: '#FFB4AB', // Error 80
      light: '#FFDAD6', // Error 90
      dark: '#FF8A80', // Error 70
      contrastText: '#1C1B1F',
    },
    // Background colors (Expressive)
    background: {
      default: '#1C1B1F',
      paper: '#1C1B1F',
      container: '#211F26',
      containerHigh: '#2B2930',
      containerHighest: '#2B2930',
    },
    // Text colors (Expressive)
    text: {
      primary: '#E6E1E5',
      secondary: '#CAC4D0',
      disabled: '#49454F',
    },
    // Outline colors (Expressive)
    outline: {
      main: '#938F99',
      variant: '#49454F',
    },
  },
};

// Get Windows accent color from Electron main process
const getWindowsAccentColor = () => {
  // Default fallback to Material 3 primary
  return '#6750A4';
};

const createMaterial3ExpressiveTheme = (mode: 'light' | 'dark', accentColor: string = '#6750A4') => {
  const colors = MATERIAL_3_EXPRESSIVE_COLORS[mode];
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: accentColor,
        light: colors.primary.light,
        dark: colors.primary.dark,
        contrastText: colors.primary.contrastText,
      },
      secondary: {
        main: colors.secondary.main,
        light: colors.secondary.light,
        dark: colors.secondary.dark,
        contrastText: colors.secondary.contrastText,
      },
      error: {
        main: colors.error.main,
        light: colors.error.light,
        dark: colors.error.dark,
        contrastText: colors.error.contrastText,
      },
      background: {
        default: colors.background.default,
        paper: colors.background.paper,
      },
      text: {
        primary: colors.text.primary,
        secondary: colors.text.secondary,
        disabled: colors.text.disabled,
      },
      divider: colors.outline.variant,
      action: {
        hover: mode === 'light' 
          ? 'rgba(103, 80, 164, 0.08)' 
          : 'rgba(208, 188, 255, 0.08)',
        selected: mode === 'light' 
          ? 'rgba(103, 80, 164, 0.12)' 
          : 'rgba(208, 188, 255, 0.12)',
        disabled: mode === 'light' 
          ? 'rgba(28, 27, 31, 0.38)' 
          : 'rgba(230, 225, 229, 0.38)',
      },
    },
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 400,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 400,
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 400,
        lineHeight: 1.3,
        letterSpacing: '0em',
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 400,
        lineHeight: 1.4,
        letterSpacing: '0.01em',
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 400,
        lineHeight: 1.4,
        letterSpacing: '0.01em',
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.5,
        letterSpacing: '0.01em',
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5,
        letterSpacing: '0.01em',
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.43,
        letterSpacing: '0.01em',
      },
      button: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.75,
        letterSpacing: '0.01em',
        textTransform: 'none',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 20,
            padding: '10px 24px',
            fontWeight: 500,
            fontSize: '0.875rem',
            lineHeight: 1.75,
            letterSpacing: '0.01em',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: mode === 'light' 
                ? '0 4px 16px rgba(103, 80, 164, 0.2)' 
                : '0 4px 16px rgba(208, 188, 255, 0.2)',
            },
            '&:active': {
              transform: 'translateY(0px)',
              transition: 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: mode === 'light' 
              ? '0px 1px 3px 0px rgba(0, 0, 0, 0.12), 0px 1px 2px 0px rgba(0, 0, 0, 0.24)'
              : '0px 1px 3px 0px rgba(0, 0, 0, 0.12), 0px 1px 2px 0px rgba(0, 0, 0, 0.24)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: mode === 'light' 
                ? '0px 4px 8px 0px rgba(0, 0, 0, 0.12), 0px 2px 4px 0px rgba(0, 0, 0, 0.24)'
                : '0px 4px 8px 0px rgba(0, 0, 0, 0.12), 0px 2px 4px 0px rgba(0, 0, 0, 0.24)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'scale(1.05)',
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
          },
        },
      },
      MuiSpeedDial: {
        styleOverrides: {
          root: {
            '& .MuiFab-primary': {
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'scale(1.05)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
            },
          },
        },
      },
    },
  });
};

const AppWrapper = () => {
  const [mode, setMode] = React.useState<'light' | 'dark'>(getSystemTheme());
  const [accentColor, setAccentColor] = React.useState<string>('#6750A4');
  const theme = createMaterial3ExpressiveTheme(mode, accentColor);

  // Listen for system theme changes
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setMode(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Listen for accent color changes from main process
  React.useEffect(() => {
    if (window.electronAPI) {
      // Get initial accent color
      window.electronAPI.getAccentColor();
      
      // Listen for accent color updates
      window.electronAPI.onAccentColorUpdated((newAccentColor: string) => {
        const hex = electronAccentToHex(newAccentColor);
        console.log('Received accent color from main process:', newAccentColor, '->', hex);
        setAccentColor(hex);
      });
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App mode={mode} setMode={setMode} />
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
); 