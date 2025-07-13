import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  Alert,
  FormHelperText,
  InputAdornment
} from '@mui/material';
import {
  Keyboard as KeyboardIcon,
  Search as SearchIcon,
  Link as LinkIcon
} from '@mui/icons-material';

interface SearchEngine {
  id: string;
  name: string;
  url: string;
  hotkey: string;
}

interface NewSnipDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (engine: SearchEngine) => void;
  editingEngine?: SearchEngine | null;
}

const NewSnipDialog: React.FC<NewSnipDialogProps> = ({
  open,
  onClose,
  onSave,
  editingEngine
}) => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    hotkey: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isRecordingHotkey, setIsRecordingHotkey] = useState(false);
  const [recordingKeys, setRecordingKeys] = useState<string[]>([]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      if (editingEngine) {
        setFormData({
          name: editingEngine.name,
          url: editingEngine.url,
          hotkey: editingEngine.hotkey
        });
      } else {
        setFormData({ name: '', url: '', hotkey: '' });
      }
      setErrors({});
      setRecordingKeys([]);
      setIsRecordingHotkey(false);
    }
  }, [open, editingEngine]);

  // Handle hotkey recording
  useEffect(() => {
    if (!isRecordingHotkey) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      let keys = [...recordingKeys];

      // Add modifier keys if pressed
      if (event.ctrlKey || event.metaKey) if (!keys.includes('CommandOrControl')) keys.push('CommandOrControl');
      if (event.altKey) if (!keys.includes('Alt')) keys.push('Alt');
      if (event.shiftKey) if (!keys.includes('Shift')) keys.push('Shift');
      if (event.metaKey && !event.ctrlKey) if (!keys.includes('Meta')) keys.push('Meta');

      // Add the main key if not a modifier and not already present
      if (!['Control', 'Alt', 'Shift', 'Meta'].includes(event.key)) {
        const mainKey = event.key.toUpperCase();
        if (!keys.includes(mainKey)) keys.push(mainKey);
      }

      // Limit to 5 keys
      if (keys.length > 5) keys = keys.slice(0, 5);

      setRecordingKeys(keys);
      setFormData(prev => ({ ...prev, hotkey: keys.join('+') }));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      // Stop recording when all keys are released
      setIsRecordingHotkey(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isRecordingHotkey, recordingKeys]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Search engine name is required';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'Search URL is required';
    } else if (!formData.url.includes('{query}')) {
      newErrors.url = 'URL must contain {query} placeholder';
    }

    if (!formData.hotkey.trim()) {
      newErrors.hotkey = 'Hotkey is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const engine: SearchEngine = {
        id: editingEngine?.id || Date.now().toString(),
        name: formData.name.trim(),
        url: formData.url.trim(),
        hotkey: formData.hotkey
      };
      onSave(engine);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const startHotkeyRecording = () => {
    setIsRecordingHotkey(true);
    setRecordingKeys([]);
  };

  const formatHotkey = (hotkey: string) => {
    return hotkey
      .replace('CommandOrControl', 'Ctrl')
      .replace('Alt', 'Alt')
      .replace('Shift', 'Shift')
      .replace('Meta', 'Win')
      .replace('+', ' + ');
  };

  const getPresetUrls = () => [
    { name: 'Google', url: 'https://www.google.com/search?q={query}' },
    { name: 'YouTube', url: 'https://www.youtube.com/results?search_query={query}' },
    { name: 'GitHub', url: 'https://github.com/search?q={query}' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com/search?q={query}' },
    { name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Special:Search?search={query}' },
    { name: 'Reddit', url: 'https://www.reddit.com/search/?q={query}' }
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'background.paper'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        {editingEngine ? 'Edit Search Engine' : 'New Search Engine'}
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Create a custom search shortcut
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Name Field */}
          <TextField
            label="Search Engine Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            placeholder="e.g., YouTube, Google, GitHub"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* URL Field */}
          <TextField
            label="Search URL"
            value={formData.url}
            onChange={(e) => handleInputChange('url', e.target.value)}
            error={!!errors.url}
            helperText={errors.url || 'Use {query} as placeholder for search term'}
            fullWidth
            placeholder="https://www.google.com/search?q={query}"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Preset URLs */}
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Quick presets:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {getPresetUrls().map((preset) => (
                <Chip
                  key={preset.name}
                  label={preset.name}
                  size="small"
                  variant="outlined"
                  clickable
                  onClick={() => {
                    handleInputChange('name', preset.name);
                    handleInputChange('url', preset.url);
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Hotkey Field */}
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Hotkey:
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                label="Press keys to record"
                value={formData.hotkey ? formatHotkey(formData.hotkey) : ''}
                error={!!errors.hotkey}
                helperText={errors.hotkey}
                fullWidth
                placeholder="Click to record hotkey"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyboardIcon color="action" />
                    </InputAdornment>
                  ),
                  readOnly: true,
                }}
                onClick={startHotkeyRecording}
                sx={{ cursor: 'pointer' }}
              />
              
              <Button
                variant={isRecordingHotkey ? "contained" : "outlined"}
                onClick={startHotkeyRecording}
                startIcon={<KeyboardIcon />}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                {isRecordingHotkey ? 'Recording...' : 'Record'}
              </Button>
            </Box>
            
            {isRecordingHotkey && (
              <Alert severity="info" sx={{ mt: 1 }}>
                Press the key combination you want to use for this search engine
              </Alert>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={!formData.name || !formData.url || !formData.hotkey}
        >
          {editingEngine ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewSnipDialog; 