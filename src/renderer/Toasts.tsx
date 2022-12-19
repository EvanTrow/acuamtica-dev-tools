import * as React from 'react';

import { SnackbarKey, useSnackbar } from 'notistack';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import App from './App';
import { SnackbarAlert } from './types';
import Button from '@mui/material/Button';

type ButtonActionProps = {
	key: SnackbarKey;
	action:
		| {
				event: string;
				btnText: string;
				args?: any[];
		  }
		| undefined;
};

function ButtonAction(props: ButtonActionProps) {
	// console.log(props);
	const { closeSnackbar } = useSnackbar();

	return (
		<Button
			onClick={() => {
				window.electronAPI.events.sendMessage(props.action?.event, props.action?.args);
				closeSnackbar(props.key);
			}}
			sx={{ marginRight: 1 }}
			variant='contained'
			color='inherit'
		>
			<div style={{ color: '#000' }}>{props.action?.btnText}</div>
		</Button>
	);
}

export default function Toasts() {
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	window.electronAPI.events.on('alert', (arg) => {
		let alert: SnackbarAlert = arg as SnackbarAlert;

		console.log(alert);

		enqueueSnackbar(alert.text, {
			...alert.options,
			preventDuplicate: true,
			action: (key) => (
				<>
					{alert.action && <ButtonAction key={key} action={alert.action} />}
					<IconButton aria-label='close' size='small' onClick={() => closeSnackbar(key)}>
						<CloseIcon />
					</IconButton>
				</>
			),
		});
	});

	return <App />;
}
