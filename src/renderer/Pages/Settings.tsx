import * as React from 'react';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import Button from '@mui/material/Button';
import SecurityUpdateIcon from '@mui/icons-material/SecurityUpdate';

export default function Instances() {
	const [hostname, setHostname] = React.useState(window.appSettings.hostname);

	const [instanceLocation, setInstanceLocation] = React.useState(window.appSettings.instanceLocation);
	const [instanceLocationValid, setInstanceLocationValid] = React.useState(true);

	const [buildLocation, setBuildLocation] = React.useState(window.appSettings.buildLocation);
	const [buildLocationValid, setBuildLocationValid] = React.useState(true);

	const [version, setVersion] = React.useState('');

	React.useEffect(() => {
		window.electronAPI
			.getAppVersion()
			.then((appVersion) => {
				setVersion(appVersion);
			})
			.catch((e) => {
				console.error(e);
			});
	}, []);

	const updateHostname = (hostname: string) => {
		setHostname(hostname);
		window.appSettings.hostname = hostname;
		window.electronAPI.execSQL(`UPDATE settings SET hostname = '${hostname}';`);
	};

	const updateInstanceLocation = async (instanceLocation: string) => {
		setInstanceLocation(instanceLocation);
		var validPath = await checkPath(instanceLocation);
		setInstanceLocationValid(validPath || instanceLocation === '');
		if (validPath || instanceLocation === '') {
			window.appSettings.instanceLocation = instanceLocation;
			window.electronAPI.execSQL(`UPDATE settings SET instanceLocation = '${instanceLocation}';`);
		}
	};

	const updateBuildLocation = async (buildLocation: string) => {
		setBuildLocation(buildLocation);
		var validPath = await checkPath(buildLocation);
		setBuildLocationValid(validPath || buildLocation === '');
		if (validPath || buildLocation === '') {
			window.appSettings.buildLocation = buildLocation;
			window.electronAPI.execSQL(`UPDATE settings SET buildLocation = '${buildLocation}';`);
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
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12}>
					<Card sx={{ minWidth: 275 }}>
						<CardContent>
							<Typography gutterBottom variant='h5' component='div'>
								About
							</Typography>
							<Typography gutterBottom variant='body1' component='div'>
								Version: {version}
							</Typography>
							<Button
								variant='contained'
								endIcon={<SecurityUpdateIcon />}
								onClick={() => {
									window.electronAPI.checkForAppUpdate();
								}}
							>
								Check for updates
							</Button>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</>
	);
}
