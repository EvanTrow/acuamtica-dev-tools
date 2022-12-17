import * as React from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

export type AlertDialogProps = {
	title: string;
	detail: any;
	open: boolean;
	setOpen(open: boolean): void;
	confirm(data?: any): void;
	dismissBtn?: string;
	confirmBtn?: string;
	confirmBtnColor?: buttonColor | 'primary';
	data?: any;
};

export type buttonColor = 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';

export default function AlertDialog(props: AlertDialogProps) {
	const handleClose = () => {
		props.setOpen(false);
	};

	return (
		<div>
			{props.open.valueOf()}
			<Dialog maxWidth='sm' fullWidth open={props.open} onClose={handleClose}>
				<DialogTitle id='alert-dialog-title'>{props.title}</DialogTitle>
				<DialogContent>
					<DialogContentText id='alert-dialog-description'>{props.detail}</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color='inherit'>
						{props.dismissBtn || 'Cancel'}
					</Button>
					<Button
						variant='contained'
						onClick={() => {
							handleClose();
							console.log(props);
							props.confirm(props.data);
						}}
						color={props.confirmBtnColor}
					>
						{props.confirmBtn || 'Confirm'}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
