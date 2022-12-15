import * as React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';

import App from './App';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export type SnackbarAlert = {
  open: boolean;
  text: string;
  severity: AlertColor;
};

export default function Theme() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  );

  const [snackbar, setSnackbar] = React.useState<SnackbarAlert>({
    open: false,
    text: '',
    severity: 'info',
  });

  window.electron.ipcRenderer.on('alert', (arg) => {
    // eslint-disable-next-line no-console
    console.log(arg);

    setSnackbar(arg as SnackbarAlert);
  });

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbar({
      open: false,
      text: '',
      severity: snackbar.severity,
    });
  };

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleClose}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.text}
          </Alert>
        </Snackbar>

        <App key={0} />
      </ThemeProvider>
    </Router>
  );
}
