import { useState } from 'react';
import { AlertColor } from '@mui/material';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'info'
  });

  const showSnackbar = (message: string, severity: AlertColor = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const hideSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const showSuccess = (message: string) => {
    showSnackbar(message, 'success');
  };

  const showError = (message: string) => {
    showSnackbar(message, 'error');
  };

  const showInfo = (message: string) => {
    showSnackbar(message, 'info');
  };

  const showWarning = (message: string) => {
    showSnackbar(message, 'warning');
  };

  return {
    snackbar,
    showSnackbar,
    hideSnackbar,
    showSuccess,
    showError,
    showInfo,
    showWarning
  };
};

export default useSnackbar; 