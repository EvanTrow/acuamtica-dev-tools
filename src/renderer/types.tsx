import { AlertColor } from '@mui/material/Alert';

export type SettingsRow = {
	menuOpen: boolean;
	hostname: string;
	instanceLocation: string;
	buildLocation: string;
	extractMsi: boolean;
	windowWidth: number;
	windowheight: number;
	startMinimized: boolean;
	minimizeToTray: boolean;
	resetPassword: string;
	resetPasswordAll: boolean;
};

export type InstanceRow = {
	name: string;
	path: string;
	installPath: string;
	version?: string;
	dbName?: string;
	dbSize?: number;
	dbLogSize?: number;
	dbTotalSize?: number;
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
