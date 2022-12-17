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

export default function BuildSearchDialog(props: BuildSearchDialogProps) {
	const openRef = usePrevious(props.open);

	const [builds, setBuilds] = React.useState<BuildRow[]>([]);
	const [selectedBuild, setSelectedBuild] = React.useState<BuildRow | undefined>();
	const [extractMsi, setExtractMsi] = React.useState(window.appSettings.extractMsi);
	const [tempBuild, setTempBuild] = React.useState<BuildRow | undefined>();

	const [alertOpen, setAlertOpen] = React.useState(false);

	const [downloadProgressOpen, setDownloadProgressOpen] = React.useState(false);
	const [downloadProgress, setDownloadProgress] = React.useState(0);
	const [downloadTotal, setDownloadTotal] = React.useState(0);
	const [extractProgress, setExtractProgress] = React.useState(0);
	const [extractTotal, setExtractTotal] = React.useState(0);
	const [downloadComplete, setDownloadComplete] = React.useState('');
	const [statuses, setStatuses] = React.useState<string[]>([]);

	const updateExtractMsi = async (extractMsi: boolean) => {
		setExtractMsi(extractMsi);
		window.appSettings.extractMsi = extractMsi;
		window.electronAPI.execSQL(`UPDATE settings SET extractMsi = ${extractMsi ? 1 : 0};`);
	};

	React.useEffect(() => {
		if (openRef == false && builds.length == 0) {
			window.electronAPI.getAvailableBuilds().then((builds) => {
				setBuilds(builds);
				console.log(builds);
			});
		}
	}, [props.open]);

	const handleClose = async () => {
		props.setOpen(false);
		if (selectedBuild) {
			var validPath = await checkPath(path.join(window.appSettings.buildLocation, selectedBuild?.build));

			setTempBuild(selectedBuild);

			if (validPath && window.appSettings.extractMsi == true) {
				setAlertOpen(true);
			} else {
				downloadBuild(selectedBuild);
			}
			setSelectedBuild(undefined);
		}
	};

	const downloadBuild = (build: any) => {
		setDownloadProgressOpen(true);

		if (typeof build?.path == 'undefined') {
			window.electronAPI.sendToast(`Downloading Build: ${build.build.build}`, 'info');
			window.electronAPI.downloadBuild(build.build, extractMsi);
		} else {
			window.electronAPI.sendToast(`Downloading Build: ${build.build}`, 'info');
			window.electronAPI.downloadBuild(build, extractMsi);
		}

		startListeners();
	};

	const checkPath = async (path: string): Promise<boolean> => {
		const result = await window.electronAPI.checkPath(path);
		return result;
	};

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
		setDownloadProgressOpen(false);
		setDownloadProgress(0);
		setDownloadTotal(0);
		setExtractProgress(0);
		setExtractTotal(0);
		setDownloadComplete('');
		setStatuses([]);

		setDownloadProgressOpen(false);
	};

	return (
		<div>
			{props.open.valueOf()}
			<Dialog
				maxWidth='sm'
				fullWidth
				open={props.open}
				onClose={() => {
					props.setOpen(false);
					setSelectedBuild(undefined);
				}}
			>
				<DialogTitle>Download Build</DialogTitle>
				<DialogContent>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Autocomplete
								options={builds}
								groupBy={(option) => option.version}
								getOptionLabel={(option) => option.build}
								renderInput={(params) => <TextField {...params} label='Build Number' />}
								sx={{ marginTop: 1 }}
								value={selectedBuild}
								onChange={(event: any, newValue: BuildRow | null) => {
									setSelectedBuild(newValue as BuildRow);
								}}
							/>
						</Grid>

						<Grid item xs={12}>
							<FormGroup>
								<FormControlLabel control={<Switch checked={extractMsi} onChange={(e) => updateExtractMsi(e.target.checked)} />} label='Extract MSI' />
							</FormGroup>
							<FormHelperText>Extract contents of MSI folder when download completes</FormHelperText>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button color='inherit' onClick={handleClose}>
						Cancel
					</Button>
					<Button variant='contained' disabled={!selectedBuild} onClick={handleClose}>
						Download
					</Button>
				</DialogActions>
			</Dialog>

			<AlertDialog
				open={alertOpen}
				title='Build Already Exists'
				detail={
					<>
						A folder with this build number already exists.
						<br />
						<br />
						<b style={{ color: '#f44336' }}>Delete folder & overwrite?</b>
					</>
				}
				confirmBtn='Overwrite'
				confirmBtnColor='error'
				confirm={downloadBuild}
				setOpen={setAlertOpen}
				data={{ build: tempBuild }}
			/>

			<Dialog maxWidth='sm' fullWidth open={downloadProgressOpen} onClose={() => closeDownloadProgress()} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
				<DialogTitle id='alert-dialog-title'>
					Downlading{window.appSettings.extractMsi ? ' & Extracting' : ''} Build: {tempBuild?.build}
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
