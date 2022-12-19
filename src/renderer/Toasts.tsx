import * as React from 'react';

import { useSnackbar } from 'notistack';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import App from './App';
import { SnackbarAlert } from './types';

export default function Toasts() {
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	window.electronAPI.events.on('alert', (arg) => {
		let alert: SnackbarAlert = arg as SnackbarAlert;

		enqueueSnackbar(alert.text, {
			...alert.options,
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

	return <App />;
}
