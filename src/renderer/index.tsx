import React, { useEffect, useState } from 'react';

import { createRoot } from 'react-dom/client';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { SnackbarProvider } from 'notistack';

import Theme from './Theme';
import { SettingsRow } from './types';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const container = document.getElementById('root')!;
const root = createRoot(container);

window.electronAPI
	.getSettings()
	.then((settings: SettingsRow) => {
		window.appSettings = settings;

		console.log(settings);

		root.render(
			<React.StrictMode>
				<SnackbarProvider maxSnack={3}>
					<Theme key={0} />
				</SnackbarProvider>
			</React.StrictMode>
		);
	})
	.catch((err) => {
		root.render(
			<React.StrictMode>
				<SnackbarProvider maxSnack={3}>
					<Theme key={0} />
				</SnackbarProvider>
				<Snackbar open={true} autoHideDuration={6000}>
					<Alert severity='error' sx={{ width: '100%' }}>
						Error getting settings: {String(err)}
					</Alert>
				</Snackbar>
			</React.StrictMode>
		);
	});
