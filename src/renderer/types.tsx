import { AlertColor } from '@mui/material/Alert';

export type SettingsRow = {
	menuOpen: boolean;
	hostname: string;
	instanceLocation: string;
	buildLocation: string;
	extractMsi: boolean;
};

export type InstanceRow = {
	name: string;
	path: string;
	version: string;
	installPath: string;
	dbName: string;
	dbSize: number;
	dbLogSize: number;
	dbTotalSize: number;
};

export type BuildRow = {
	build: string;
	version: string;
	path: string;
};

export type SnackbarAlert = {
	text: string;
	options: {
		variant: AlertColor;
		autoHideDuration?: number | null | undefined;
	};
	action?: {
		btnText: string;
		event: string;
		args?: any[];
	};
};
