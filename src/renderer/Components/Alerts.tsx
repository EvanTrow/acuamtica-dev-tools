import { Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';

export function InstanceSettingsAlert() {
	return (
		<Stack sx={{ width: '100%' }} spacing={2}>
			<Alert
				severity='warning'
				action={
					<Button color='inherit' size='small' component={Link} to='/settings'>
						Settings
					</Button>
				}
			>
				<AlertTitle>Warning</AlertTitle>
				Please setup instances in settings.
			</Alert>
		</Stack>
	);
}
export function InstanceSettingsComplete(): boolean {
	if (window.appSettings.instanceLocation != null) {
		return true;
	}
	return false;
}

export function BuildsSettingsAlert() {
	return (
		<Stack sx={{ width: '100%' }} spacing={2}>
			<Alert
				severity='warning'
				action={
					<Button color='inherit' size='small' component={Link} to='/settings'>
						Settings
					</Button>
				}
			>
				<AlertTitle>Warning</AlertTitle>
				Please setup builds in settings.
			</Alert>
		</Stack>
	);
}
export function BuildsSettingsComplete(): boolean {
	if (window.appSettings.buildLocation != null) {
		return true;
	}
	return false;
}
