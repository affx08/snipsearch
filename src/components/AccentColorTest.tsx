import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';

const AccentColorTest: React.FC = () => {
  const [accentColor, setAccentColor] = useState<string>('#6750A4');

  useEffect(() => {
    if (window.electronAPI) {
      // Get initial accent color
      window.electronAPI.getAccentColor();
      
      // Listen for accent color updates
      window.electronAPI.onAccentColorUpdated((newAccentColor: string) => {
        console.log('AccentColorTest: Received accent color:', newAccentColor);
        setAccentColor(newAccentColor);
      });
    }
  }, []);

  return (
    <Paper 
      sx={{ 
        p: 2, 
        m: 2, 
        backgroundColor: accentColor,
        color: '#FFFFFF',
        textAlign: 'center'
      }}
    >
      <Typography variant="h6">
        Windows Accent Color: {accentColor}
      </Typography>
      <Typography variant="body2">
        This color should match your Windows accent color
      </Typography>
    </Paper>
  );
};

export default AccentColorTest; 