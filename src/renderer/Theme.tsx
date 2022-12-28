import * as React from 'react';
import { HashRouter as Router } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { SnackbarProvider } from 'notistack';

import Toasts from './Toasts';

export default function Theme() {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

	const theme = React.useMemo(
		() =>
			createTheme({
				palette: {
					mode: prefersDarkMode ? 'dark' : 'light',
					primary: {
						light: '#80e27e',
						main: '#4caf50',
						dark: '#087f23',
						contrastText: '#fff',
					},
					secondary: {
						light: '#ff7961',
						main: '#f44336',
						dark: '#ba000d',
						contrastText: '#000',
					},
				},
			}),
		[prefersDarkMode]
	);

	return (
		<Router>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<SnackbarProvider maxSnack={5}>
					<Toasts />
				</SnackbarProvider>
			</ThemeProvider>
		</Router>
	);
}
