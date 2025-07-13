import React, { useEffect } from 'react';
import { Box, Typography, Slide } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface ToastHUDProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

const ToastHUD: React.FC<ToastHUDProps> = ({ open, message, onClose }) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        left: '50%',
        bottom: 32,
        transform: 'translateX(-50%)',
        zIndex: 1400,
        pointerEvents: 'none',
        width: 'auto',
        maxWidth: 400,
      }}
    >
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Box
          sx={{
            background: 'rgba(30, 30, 30, 0.98)',
            color: '#fff',
            borderRadius: 3,
            padding: '16px 32px',
            boxShadow: '0px 8px 32px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            minWidth: 200,
            maxWidth: 400,
            fontSize: '1.1rem',
            fontWeight: 500,
          }}
        >
          <SearchIcon color="primary" />
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#fff' }}>
            {message}
          </Typography>
        </Box>
      </Slide>
    </Box>
  );
};

export default ToastHUD; 