import * as React from 'react';

import TextField from '@mui/material/TextField';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { SettingsRow } from '../types';
import Grid from '@mui/material/Grid';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormHelperText from '@mui/material/FormHelperText';

export default function Instances() {
	const [hostname, setHostname] = React.useState(window.appSettings.hostname);

	const [instanceLocation, setInstanceLocation] = React.useState(window.appSettings.instanceLocation);
	const [instanceLocationValid, setInstanceLocationValid] = React.useState(true);

	const [buildLocation, setBuildLocation] = React.useState(window.appSettings.buildLocation);
	const [buildLocationValid, setBuildLocationValid] = React.useState(true);
	const [extractMsi, setExtractMsi] = React.useState(window.appSettings.extractMsi);
	const [lessmsiPath, setLessmsiPath] = React.useState(window.appSettings.lessmsiPath);
	const [lessmsiPathValid, setLessmsiPathValid] = React.useState(true);

	const updateHostname = (hostname: string) => {
		setHostname(hostname);
		window.appSettings.hostname = hostname;
		window.electronAPI.execSQL(`UPDATE settings SET hostname = "${hostname}";`);
	};

	const updateInstanceLocation = async (instanceLocation: string) => {
		setInstanceLocation(instanceLocation);
		var validPath = await checkPath(instanceLocation);
		setInstanceLocationValid(validPath || instanceLocation === '');
		if (validPath || instanceLocation === '') {
			window.appSettings.instanceLocation = instanceLocation;
			window.electronAPI.execSQL(`UPDATE settings SET instanceLocation = "${instanceLocation}";`);
		}
	};

	const updateBuildLocation = async (buildLocation: string) => {
		setBuildLocation(buildLocation);
		var validPath = await checkPath(buildLocation);
		setBuildLocationValid(validPath || buildLocation === '');
		if (validPath || buildLocation === '') {
			window.appSettings.buildLocation = buildLocation;
			window.electronAPI.execSQL(`UPDATE settings SET buildLocation = "${buildLocation}";`);
		}
	};

	const updateExtractMsi = async (extractMsi: boolean) => {
		setExtractMsi(extractMsi);
		window.appSettings.extractMsi = extractMsi;
		window.electronAPI.execSQL(`UPDATE settings SET extractMsi = ${extractMsi ? 1 : 0};`);
	};

	const updateLessmsiPath = async (lessmsiPath: string) => {
		setLessmsiPath(lessmsiPath);
		var validPath = await checkPath(lessmsiPath);
		setLessmsiPathValid(validPath && lessmsiPath.endsWith('.exe'));
		if (validPath && lessmsiPath.endsWith('.exe')) {
			window.appSettings.lessmsiPath = lessmsiPath;
			window.electronAPI.execSQL(`UPDATE settings SET lessmsiPath = "${lessmsiPath}";`);
		}
	};

	const checkPath = async (path: string): Promise<boolean> => {
		const result = await window.electronAPI.checkPath(path);
		return result;
	};

	return (
		<>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Card sx={{ minWidth: 275 }}>
						<CardContent>
							<Typography gutterBottom variant='h5' component='div'>
								General
							</Typography>
							<TextField label='Hostname' fullWidth variant='outlined' value={hostname} onChange={(e) => updateHostname(e.target.value)} />
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12}>
					<Card sx={{ minWidth: 275 }}>
						<CardContent>
							<Typography gutterBottom variant='h5' component='div'>
								Instance Browser
							</Typography>
							<TextField
								label='Instance Location'
								fullWidth
								variant='outlined'
								helperText={instanceLocationValid ? 'Folder path where your Acuamtica instances are installed.' : 'Invalid Path'}
								value={instanceLocation}
								onChange={(e) => updateInstanceLocation(e.target.value)}
								error={!instanceLocationValid}
							/>
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12}>
					<Card sx={{ minWidth: 275 }}>
						<CardContent>
							<Typography gutterBottom variant='h5' component='div'>
								Builds
							</Typography>
							<TextField
								label='Builds Location'
								fullWidth
								variant='outlined'
								helperText={buildLocationValid ? 'Folder path where your Acuamtica builds are stored.' : 'Invalid Path'}
								value={buildLocation}
								onChange={(e) => updateBuildLocation(e.target.value)}
								error={!buildLocationValid}
							/>
							<FormGroup>
								<FormControlLabel control={<Switch checked={extractMsi} onChange={(e) => updateExtractMsi(e.target.checked)} />} label='Extract MSI' />
							</FormGroup>
							<FormHelperText>Extract contents of MSI folder when download completes</FormHelperText>
							<br />
							{extractMsi ? (
								<TextField
									label='lessmsi Path'
									fullWidth
									variant='outlined'
									helperText={lessmsiPathValid ? 'Path to lessmsi.exe' : 'Invalid Path'}
									value={lessmsiPath}
									onChange={(e) => updateLessmsiPath(e.target.value)}
									error={!lessmsiPathValid}
								/>
							) : (
								''
							)}
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</>
	);
}
