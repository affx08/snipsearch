import React from 'react';
import { Button, ButtonProps, Box } from '@mui/material';

interface PillButtonProps extends ButtonProps {
  icon?: React.ReactNode;
  label: string;
  selected?: boolean;
}

const PillButton: React.FC<PillButtonProps> = ({ icon, label, selected, ...props }) => {
  return (
    <Button
      {...props}
      startIcon={icon}
      sx={{
        borderRadius: 999,
        px: 4,
        py: 2,
        fontWeight: 600,
        fontSize: '1.1rem',
        minHeight: 56,
        backgroundColor: selected ? 'primary.main' : 'background.paper',
        color: selected ? 'primary.contrastText' : 'text.primary',
        boxShadow: selected 
          ? '0 8px 32px rgba(0, 0, 0, 0.12)' 
          : '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: selected ? 'none' : '2px solid',
        borderColor: 'divider',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        textTransform: 'none',
        letterSpacing: '0.025em',
        '&:hover': {
          backgroundColor: selected ? 'primary.dark' : 'action.hover',
          transform: selected ? 'translateY(-2px)' : 'translateY(-1px)',
          boxShadow: selected 
            ? '0 12px 40px rgba(0, 0, 0, 0.16)' 
            : '0 4px 16px rgba(0, 0, 0, 0.12)',
        },
        '&:active': {
          transform: 'translateY(0px)',
          transition: 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '&:focus': {
          outline: 'none',
          boxShadow: selected 
            ? '0 0 0 4px rgba(25, 118, 210, 0.2)' 
            : '0 0 0 4px rgba(0, 0, 0, 0.1)',
        },
        '& .MuiButton-startIcon': {
          marginRight: 2,
          '& .MuiSvgIcon-root': {
            fontSize: '1.5rem',
          },
        },
        ...props.sx,
      }}
    >
      {label}
    </Button>
  );
};

export default PillButton; 