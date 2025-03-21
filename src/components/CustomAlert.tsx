import React from 'react';
import { Alert, AlertTitle, Snackbar, Box } from '@mui/material';
import { AlertColor } from '@mui/material/Alert';

interface CustomAlertProps {
  open: boolean;
  onClose: () => void;
  severity: AlertColor;
  message: string;
  title?: string;
  autoHideDuration?: number;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  open,
  onClose,
  severity,
  message,
  title,
  autoHideDuration = 3000,
}) => {
  // Custom styling based on severity
  const getCustomStyles = () => {
    const baseStyles = {
      width: '100%',
      minWidth: '260px',
      maxWidth: '320px',
      borderRadius: '6px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
      padding: '8px 14px',
      border: 'none',
      animation: 'fadeIn 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      '& .MuiAlert-icon': {
        fontSize: '18px',
        marginRight: '10px',
        alignSelf: 'center',
        opacity: 0.85
      },
      '& .MuiAlert-message': {
        padding: '2px 0',
        width: '100%'
      },
      '& .MuiAlert-action': {
        padding: '0 0 0 8px',
        alignSelf: 'center',
        '& .MuiSvgIcon-root': {
          fontSize: '18px',
          opacity: 0.7
        }
      },
      '@keyframes fadeIn': {
        '0%': { opacity: 0, transform: 'translateY(-8px) scale(0.98)' },
        '70%': { opacity: 1, transform: 'translateY(1px)' },
        '100%': { opacity: 1, transform: 'translateY(0) scale(1)' }
      }
    };

    // Elegant colors based on severity with transparency
    switch (severity) {
      case 'success':
        return {
          ...baseStyles,
          backgroundColor: 'rgba(240, 247, 240, 0.92)',
          backdropFilter: 'blur(8px)',
          color: '#2c6e2c',
          borderLeft: '3px solid #4CAF50',
          '& .MuiAlert-icon': {
            color: '#2c6e2c',
          }
        };
      case 'error':
        return {
          ...baseStyles,
          backgroundColor: 'rgba(253, 242, 242, 0.92)',
          backdropFilter: 'blur(8px)',
          color: '#b91c1c',
          borderLeft: '3px solid #EF4444',
          '& .MuiAlert-icon': {
            color: '#b91c1c',
          }
        };
      case 'warning':
        return {
          ...baseStyles,
          backgroundColor: 'rgba(254, 250, 240, 0.92)',
          backdropFilter: 'blur(8px)',
          color: '#b45309',
          borderLeft: '3px solid #F59E0B',
          '& .MuiAlert-icon': {
            color: '#b45309',
          }
        };
      case 'info':
        return {
          ...baseStyles,
          backgroundColor: 'rgba(240, 244, 250, 0.92)',
          backdropFilter: 'blur(8px)',
          color: '#1e40af',
          borderLeft: '3px solid #3B82F6',
          '& .MuiAlert-icon': {
            color: '#1e40af',
          }
        };
      default:
        return baseStyles;
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{
        '& .MuiSnackbar-root': {
          maxWidth: '100%'
        },
        mt: 1
      }}
    >
      <Alert 
        onClose={onClose} 
        severity={severity}
        variant="standard"
        elevation={0}
        sx={getCustomStyles()}
      >
        {title && (
          <AlertTitle sx={{ 
            fontWeight: 600, 
            fontSize: '0.813rem',
            marginBottom: '0',
            letterSpacing: '0.01em',
            py: 0
          }}>
            {title}
          </AlertTitle>
        )}
        <Box sx={{ 
          fontSize: '0.75rem',
          lineHeight: 1.4,
          letterSpacing: '0.01em',
          fontWeight: 400
        }}>
          {message}
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default CustomAlert; 