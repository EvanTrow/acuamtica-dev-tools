import * as React from 'react';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import SecurityUpdateIcon from '@mui/icons-material/SecurityUpdate';

import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Divider from '@mui/material/Divider';

export default function Instances() {
	const [hostname, setHostname] = React.useState(window.appSettings.hostname);

	const [instanceLocation, setInstanceLocation] = React.useState(window.appSettings.instanceLocation);
	const [instanceLocationValid, setInstanceLocationValid] = React.useState(true);

	const [resetPassword, setResetPassword] = React.useState(window.appSettings.resetPassword);
	const [showResetPassword, setShowResetPassword] = React.useState(false);
	const [resetPasswordAll, setResetPasswordAll] = React.useState(window.appSettings.resetPasswordAll);

	const [buildLocation, setBuildLocation] = React.useState(window.appSettings.buildLocation);
	const [buildLocationValid, setBuildLocationValid] = React.useState(true);

	const [openAtLogin, SetOpenAtLogin] = React.useState(false);
	const [startMinimized, SetStartMinimized] = React.useState(window.appSettings.startMinimized);
	const [minimizeToTray, setMinimizeToTray] = React.useState(window.appSettings.minimizeToTray);

	const [version, setVersion] = React.useState('');

	React.useEffect(() => {
		// Get app version and set state
		window.electronAPI
			.getAppVersion()
			.then((appVersion) => {
				setVersion(appVersion);
			})
			.catch((e) => {
				console.error(e);
			});

		// get electron launch settings
		window.electronAPI
			.getAppSettings()
			.then((appSettings) => {
				SetOpenAtLogin(appSettings.launchItems.length > 0);
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

	const updateResetPassword = async (resetpassword: string) => {
		setResetPassword(resetpassword);
		window.appSettings.resetPassword = resetpassword;
		window.electronAPI.execSQL(`UPDATE settings SET resetpassword = '${resetpassword}';`);
	};

	const updateResetPasswordAll = async (resetAll: boolean) => {
		setResetPasswordAll(resetAll);
		window.appSettings.resetPasswordAll = resetAll;
		window.electronAPI.execSQL(`UPDATE settings SET resetPasswordAll = ${resetAll ? 1 : 0};`);
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
								Instances
							</Typography>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<TextField
										label='Instance Location'
										fullWidth
										variant='outlined'
										helperText={instanceLocationValid ? 'Folder path where your Acuamtica instances are installed.' : 'Invalid Path'}
										value={instanceLocation}
										onChange={(e) => updateInstanceLocation(e.target.value)}
										error={!instanceLocationValid}
									/>
								</Grid>
								<Grid item xs={12}>
									<Card>
										<CardContent>
											<Typography gutterBottom variant='h6' component='div'>
												User Password Reset
											</Typography>
											<FormControl fullWidth variant='outlined'>
												<InputLabel htmlFor='resetPassword'>Password</InputLabel>
												<OutlinedInput
													id='resetPassword'
													type={showResetPassword ? 'text' : 'password'}
													endAdornment={
														<InputAdornment position='end'>
															<IconButton
																aria-label='toggle password visibility'
																onMouseDown={() => {
																	setShowResetPassword(true);
																}}
																onMouseUp={() => {
																	setShowResetPassword(false);
																}}
																edge='end'
															>
																{showResetPassword ? <VisibilityOff /> : <Visibility />}
															</IconButton>
														</InputAdornment>
													}
													label='Password'
													value={resetPassword}
													onChange={(e) => updateResetPassword(e.target.value)}
												/>
											</FormControl>
											<FormGroup>
												<FormControlLabel
													control={<Switch color='error' checked={resetPasswordAll} onChange={(e) => updateResetPasswordAll(e.target.checked)} />}
													label={
														<>
															Reset <b>ALL</b> User Passwords
														</>
													}
												/>
											</FormGroup>
										</CardContent>
									</Card>
								</Grid>
							</Grid>
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
								Windows Settings
							</Typography>
							<FormControl component='fieldset' variant='standard' fullWidth>
								<FormLabel component='legend'>System Startup Behavoir</FormLabel>
								<FormGroup>
									<FormControlLabel
										control={
											<Switch
												checked={openAtLogin}
												onChange={(e) => {
													SetOpenAtLogin(e.target.checked);
													if (!e.target.checked) {
														SetStartMinimized(e.target.checked);
														window.appSettings.startMinimized = e.target.checked;
														window.electronAPI.execSQL(`UPDATE settings SET startMinimized = ${e.target.checked ? 1 : 0};`);
													}

													window.electronAPI.setAppSettings(e.target.checked);
												}}
											/>
										}
										label='Open Acumatica Dev Tools'
									/>
								</FormGroup>
								<FormHelperText>Save yourself a few clicks and let Acumatica Dev Tools launch at startup.</FormHelperText>
								<Divider sx={{ marginTop: 1.5, marginBottom: 1.5 }} />
								<FormGroup>
									<FormControlLabel
										control={
											<Switch
												checked={startMinimized}
												disabled={!openAtLogin && !startMinimized}
												onChange={(e) => {
													SetStartMinimized(e.target.checked);
													window.appSettings.startMinimized = e.target.checked;
													window.electronAPI.execSQL(`UPDATE settings SET startMinimized = ${e.target.checked ? 1 : 0};`);
												}}
											/>
										}
										label='Start Minimized'
									/>
								</FormGroup>
								<FormHelperText>Acumatica Dev Tools starts in the background and remains out of your way.</FormHelperText>
							</FormControl>
							<Divider sx={{ marginTop: 1.5, marginBottom: 1.5 }} />
							<FormControl component='fieldset' variant='standard' fullWidth>
								<FormLabel component='legend'>Close Button</FormLabel>
								<FormGroup>
									<FormControlLabel
										control={
											<Switch
												checked={minimizeToTray}
												onChange={(e) => {
													setMinimizeToTray(e.target.checked);
													window.appSettings.minimizeToTray = e.target.checked;
													window.electronAPI.execSQL(`UPDATE settings SET minimizeToTray = ${e.target.checked ? 1 : 0};`);
												}}
											/>
										}
										label='Minimize to Tray'
									/>
								</FormGroup>
								<FormHelperText>
									Hitting <b>X</b> will make Acumatica Dev Tools sit back and relax in your system tray when you close the app.
								</FormHelperText>
							</FormControl>
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
