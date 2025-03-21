import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Close, ErrorOutline } from '@mui/icons-material';

interface CustomErrorAlertProps {
  message: string;
  onClose: () => void;
}

const CustomErrorAlert: React.FC<CustomErrorAlertProps> = ({ message, onClose }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 2000,
        width: 280,
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        border: '1px solid #ffccc7',
        p: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        animation: 'slideIn 0.3s ease-out',
        '@keyframes slideIn': {
          from: {
            opacity: 0,
            transform: 'translateX(20px)',
          },
          to: {
            opacity: 1,
            transform: 'translateX(0)',
          },
        },
        '&:hover': {
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
        },
        transition: 'all 0.2s ease',
      }}
    >
      <ErrorOutline 
        sx={{ 
          color: '#ff4d4f',
          fontSize: 20,
        }} 
      />
      <Typography
        sx={{
          flex: 1,
          fontFamily: '"Playfair Display", serif',
          fontSize: '0.875rem',
          color: '#434343',
          lineHeight: 1.4,
        }}
      >
        {message}
      </Typography>
      <IconButton
        size="small"
        onClick={onClose}
        sx={{
          padding: 0.5,
          color: '#595959',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        <Close sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  );
};

export default CustomErrorAlert; 