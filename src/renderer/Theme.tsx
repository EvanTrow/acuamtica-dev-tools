import * as React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { VariantType, useSnackbar } from 'notistack';

import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AlertColor } from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import App from './App';

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

	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	window.electronAPI.events.on('alert', (arg) => {
		// console.log(arg);
		// setSnackbar(arg as SnackbarAlert);
		let alert: SnackbarAlert = arg as SnackbarAlert;
		let variant: VariantType = alert.severity;

		enqueueSnackbar(alert.text, {
			variant,
			preventDuplicate: true,
			action: (key) => (
				<>
					<IconButton aria-label='close' size='small' onClick={() => closeSnackbar(key)}>
						<CloseIcon />
					</IconButton>
				</>
			),
		});
	});

	return (
		<Router>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<App key={0} />
			</ThemeProvider>
		</Router>
	);
}
