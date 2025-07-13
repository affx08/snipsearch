import React from 'react';
import { SpeedDial, SpeedDialAction, SpeedDialIcon, Box, Fab } from '@mui/material';
import { Home as HomeIcon, Settings as SettingsIcon } from '@mui/icons-material';

interface Page {
  id: 'home' | 'settings';
  name: string;
  icon: React.ReactNode;
}

interface FloatingNavProps {
  currentPage: 'home' | 'settings';
  onPageChange: (page: 'home' | 'settings') => void;
}

const pages: Page[] = [
  { id: 'home', name: 'Home', icon: <HomeIcon /> },
  { id: 'settings', name: 'Settings', icon: <SettingsIcon /> },
];

const FloatingNav: React.FC<FloatingNavProps> = ({ currentPage, onPageChange }) => {
  // Find the current page object
  const current = pages.find((p) => p.id === currentPage) || pages[0];

  // Show all other pages as actions
  const actions = pages.filter((p) => p.id !== currentPage);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
      }}
    >
      <SpeedDial
        ariaLabel="Navigation"
        sx={{
          '& .MuiFab-primary': {
            width: 72,
            height: 72,
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: 'primary.dark',
              transform: 'scale(1.05)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.16)',
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
          },
          '& .MuiSpeedDialAction-fab': {
            width: 64,
            height: 64,
            backgroundColor: 'background.paper',
            color: 'text.primary',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: 'action.hover',
              transform: 'scale(1.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            },
          },
          '& .MuiSpeedDialAction-staticTooltip': {
            backgroundColor: 'background.paper',
            color: 'text.primary',
            fontSize: '0.875rem',
            fontWeight: 500,
            padding: '8px 16px',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          },
        }}
        icon={<SpeedDialIcon icon={current.icon} />}
        FabProps={{
          'aria-label': `Navigate to ${current.name}`,
        }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.id}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => onPageChange(action.id)}
            FabProps={{
              'aria-label': `Navigate to ${action.name}`,
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default FloatingNav; 