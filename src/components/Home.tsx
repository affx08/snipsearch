import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  IconButton,
  Tooltip,
  Chip,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Keyboard as KeyboardIcon,
  Search as SearchIcon,
  ReportProblemOutlined as ReportProblemOutlinedIcon,
  ErrorOutline as ErrorOutlineIcon
} from '@mui/icons-material';
import NewSnipDialog from './NewSnipDialog';
// import AccentColorTest from './AccentColorTest';

interface SearchEngine {
  id: string;
  name: string;
  url: string;
  hotkey: string;
}

interface HomeProps {
  searchEngines: SearchEngine[];
  onAddSearchEngine: (engine: SearchEngine) => void;
  onUpdateSearchEngine: (engine: SearchEngine) => void;
  onDeleteSearchEngine: (engineId: string) => void;
  showToastMessage: (message: string) => void;
}

const Home: React.FC<HomeProps> = ({
  searchEngines,
  onAddSearchEngine,
  onUpdateSearchEngine,
  onDeleteSearchEngine,
  showToastMessage
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEngine, setEditingEngine] = useState<SearchEngine | null>(null);

  // Listen for new snip dialog from tray
  useEffect(() => {
    const handleOpenNewSnipDialog = () => {
      setOpenDialog(true);
    };

    window.addEventListener('openNewSnipDialog', handleOpenNewSnipDialog);
    return () => {
      window.removeEventListener('openNewSnipDialog', handleOpenNewSnipDialog);
    };
  }, []);

  const handleOpenDialog = (engine?: SearchEngine) => {
    if (engine) {
      setEditingEngine(engine);
    } else {
      setEditingEngine(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEngine(null);
  };

  const handleSaveEngine = (engine: SearchEngine) => {
    if (editingEngine) {
      onUpdateSearchEngine({ ...engine, id: editingEngine.id });
      showToastMessage(`Updated ${engine.name}`);
    } else {
      onAddSearchEngine(engine);
      showToastMessage(`Added ${engine.name}`);
    }
    handleCloseDialog();
  };

  const handleDeleteEngine = (engine: SearchEngine) => {
    onDeleteSearchEngine(engine.id);
    showToastMessage(`Deleted ${engine.name}`);
  };

  const formatHotkey = (hotkey: string) => {
    return hotkey
      .replace('CommandOrControl', 'Ctrl')
      .replace('Alt', 'Alt')
      .replace('Shift', 'Shift')
      .replace('Meta', 'Win')
      .replace('+', ' + ');
  };

  return (
    <Box>
      {/* Accent Color Test removed */}
      
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Search Engines
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your custom search shortcuts
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 3 }}
        >
          New Snip
        </Button>
      </Box>

      {/* Usage & Limitations Callouts in 2 columns */}
      {searchEngines.length > 0 && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Limitations Callout - first column */}
          <Grid item xs={12} md={6}>
            <Alert 
              icon={<ErrorOutlineIcon fontSize="small" />} 
              severity="warning"
              sx={{
                bgcolor: (theme) => `rgba(${theme.palette.warning.main}, 0.15)`,
                color: (theme) => theme.palette.warning.dark,
                borderRadius: 1,
                boxShadow: (theme) => `
                  0 0 15px rgba(${theme.palette.warning.main}, 0.15),
                  0 0 5px rgba(${theme.palette.warning.main}, 0.3),
                  inset 0 0 20px rgba(${theme.palette.warning.main}, 0.05),
                  0 0 2px rgba(${theme.palette.warning.main}, 0.4),
                  0 0 1px rgba(255, 255, 255, 0.3)
                `,
                p: 1.5,
                alignItems: 'flex-start',
                minHeight: 100,
                border: (theme) => `1px solid rgba(${theme.palette.warning.main}, 0.3)`,
                backdropFilter: 'blur(10px)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 1,
                  padding: '1px',
                  background: (theme) => `linear-gradient(45deg, rgba(${theme.palette.warning.main}, 0.3), rgba(${theme.palette.warning.light}, 0.15))`,
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  pointerEvents: 'none'
                },
                '& .MuiAlert-message': {
                  opacity: 1,
                  fontSize: '0.875rem'
                },
                '& .MuiAlert-icon': {
                  opacity: 1
                }
              }}
            >
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5, opacity: 1 }}>
                  Limitations
                </Typography>
                <Typography variant="body2" sx={{ opacity: 1 }}>
                  For best results in browsers, manually copy text (Ctrl+C) before using the hotkey.
                </Typography>
              </Box>
            </Alert>
          </Grid>

          {/* How to use Callout - second column */}
          <Grid item xs={12} md={6}>
            <Alert 
              icon={<KeyboardIcon fontSize="small" />} 
              severity="info"
              sx={{
                bgcolor: (theme) => `rgba(${theme.palette.primary.main}, 0.15)`,
                color: (theme) => theme.palette.primary.dark,
                borderRadius: 1,
                boxShadow: (theme) => `
                  0 0 15px rgba(${theme.palette.primary.main}, 0.15),
                  0 0 5px rgba(${theme.palette.primary.main}, 0.3),
                  inset 0 0 20px rgba(${theme.palette.primary.main}, 0.05),
                  0 0 2px rgba(${theme.palette.primary.main}, 0.4),
                  0 0 1px rgba(255, 255, 255, 0.3)
                `,
                p: 1.5,
                alignItems: 'flex-start',
                minHeight: 100,
                border: (theme) => `1px solid rgba(${theme.palette.primary.main}, 0.3)`,
                backdropFilter: 'blur(10px)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 1,
                  padding: '1px',
                  background: (theme) => `linear-gradient(45deg, rgba(${theme.palette.primary.main}, 0.3), rgba(${theme.palette.primary.light}, 0.15))`,
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  pointerEvents: 'none'
                },
                '& .MuiAlert-message': {
                  opacity: 1,
                  fontSize: '0.875rem'
                },
                '& .MuiAlert-icon': {
                  opacity: 1
                }
              }}
            >
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5, opacity: 1 }}>
                  How to use
                </Typography>
                <Typography variant="body2" sx={{ opacity: 1 }}>
                  Copy text (Ctrl+C), then press your hotkey to search instantly.
                </Typography>
              </Box>
            </Alert>
          </Grid>
        </Grid>
      )}

      {/* Search Engines Grid */}
      {searchEngines.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No search engines yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first search shortcut to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Your First Search Engine
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {searchEngines.map((engine) => (
            <Grid item xs={12} sm={6} md={4} key={engine.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 500 }}>
                      {engine.name}
                    </Typography>
                    <Chip
                      icon={<KeyboardIcon />}
                      label={formatHotkey(engine.hotkey)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      wordBreak: 'break-all',
                      fontFamily: 'monospace',
                      fontSize: '0.75rem'
                    }}
                  >
                    {engine.url}
                  </Typography>
                </CardContent>
                
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Box>
                    <Tooltip title="Edit search engine">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(engine)}
                        sx={{ color: 'primary.main' }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Delete search engine">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteEngine(engine)}
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  <Tooltip title={`Full URL: ${engine.url}`}>
                    <Typography variant="caption" color="text.secondary">
                      {engine.url.length > 30 ? `${engine.url.substring(0, 30)}...` : engine.url}
                    </Typography>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Floating Action Button for mobile */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: { xs: 'flex', sm: 'none' }
        }}
        onClick={() => handleOpenDialog()}
      >
        <AddIcon />
      </Fab>

      {/* New Snip Dialog */}
      <NewSnipDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveEngine}
        editingEngine={editingEngine}
      />
    </Box>
  );
};

export default Home; 