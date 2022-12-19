import * as React from 'react';
import { BuildRow } from 'renderer/types';
import path from 'path-browserify';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';

import AlertDialog from './AlertDialog';
import LinearProgressWithLabel from './LinearProgressWithLabel';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Grid';

export type BuildSearchDialogProps = {
	enabled: boolean;
	open: boolean;
	setOpen(open: boolean): void;
};

const usePrevious = <T extends unknown>(value: T): T | undefined => {
	const ref = React.useRef<T>();
	React.useEffect(() => {
		ref.current = value;
	});
	return ref.current;
};

export type BuildDownloadingDialogProps = {
	build: string | undefined;
	open: boolean;
	setOpen(open: boolean): void;
};

export default function BuildDownloadingDialog(props: BuildDownloadingDialogProps) {
	const openRef = usePrevious(props.open);

	const [downloadProgress, setDownloadProgress] = React.useState(0);
	const [downloadTotal, setDownloadTotal] = React.useState(0);
	const [extractProgress, setExtractProgress] = React.useState(0);
	const [extractTotal, setExtractTotal] = React.useState(0);
	const [downloadComplete, setDownloadComplete] = React.useState('');
	const [statuses, setStatuses] = React.useState<string[]>([]);

	React.useEffect(() => {
		if (openRef == false) {
			console.log('start download');
			startListeners();
		}
	}, [props.open]);

	const startListeners = () => {
		window.electronAPI.events.on('downloadBuild-download', (arg) => {
			let values = arg as number[];

			setDownloadTotal(values[0]);
			setDownloadProgress(values[1]);
		});
		window.electronAPI.events.on('downloadBuild-extract', (arg) => {
			let values = arg as number[];

			setExtractTotal(values[0]);
			setExtractProgress(values[1]);
		});

		window.electronAPI.events.on('downloadBuild-status', (arg) => {
			console.log('downloadBuild-status', arg);
			let values = arg as string[];

			var s: string[] = statuses;
			s.push(String(values[0]));

			setStatuses(s);
		});

		window.electronAPI.events.on('downloadBuild-error', (arg) => {
			console.log('downloadBuild-error', arg);
		});

		window.electronAPI.events.on('downloadBuild-complete', (arg) => {
			console.log('downloadBuild-complete', arg);
			let values = arg as string[];
			setDownloadComplete(values[0]);
			window.electronAPI.openDirectory(values[0]);
		});
	};

	const closeDownloadProgress = () => {
		setDownloadProgress(0);
		setDownloadTotal(0);
		setExtractProgress(0);
		setExtractTotal(0);
		setDownloadComplete('');
		setStatuses([]);

		props.setOpen(false);
	};

	return (
		<div>
			<Dialog maxWidth='sm' fullWidth open={props.open} onClose={() => closeDownloadProgress()}>
				<DialogTitle>
					Downlading{window.appSettings.extractMsi ? ' & Extracting' : ''} Build: {props.build}
				</DialogTitle>
				<DialogContent>
					{downloadTotal != 0 ? (
						<>
							<Typography variant='subtitle1' component='div' sx={{ flexGrow: 1 }}>
								Downloading...
							</Typography>
							<LinearProgressWithLabel value={(downloadProgress / downloadTotal) * 100} />
						</>
					) : (
						''
					)}
					{extractTotal != 0 ? (
						<>
							<Typography variant='subtitle1' component='div' sx={{ flexGrow: 1 }}>
								Extracting...
							</Typography>
							<LinearProgressWithLabel value={(extractProgress / extractTotal) * 100} />
						</>
					) : (
						''
					)}

					{statuses.map((status) => (
						<Typography variant='subtitle1' component='div' sx={{ flexGrow: 1 }}>
							{status}
						</Typography>
					))}

					{downloadComplete != '' ? (
						<>
							<br />
							<Alert severity='success'>Download{window.appSettings.extractMsi ? ' & Extraction' : ''} Complete!</Alert>
						</>
					) : (
						''
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => closeDownloadProgress()} variant={downloadComplete != '' ? 'contained' : 'text'} color={downloadComplete != '' ? 'primary' : 'inherit'}>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
