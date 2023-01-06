import { BuildRow, InstanceRow, SettingsRow, SnackbarAlert } from './types';
import { AlertColor } from '@mui/material/Alert';

export interface IElectronAPI {
	windowEvents: (action: string) => void;
	sendToast: (alert: SnackbarAlert) => void;
	getAppVersion: () => Promise<string>;
	checkForAppUpdate: () => void;
	launchApp: (path: string) => Promise<boolean>;
	openDirectory: (path: string) => Promise<boolean>;
	openPDF: (url: string) => void;

	getSettings: () => Promise<SettingsRow>;
	getAppSettings: () => Promise<Electron.LoginItemSettings>;
	setAppSettings: (openAtLogin: boolean) => Promise<boolean>;
	checkPath: (filePath: string) => Promise<boolean>;
	execSQL: (query: string) => void;

	reloadInstances: () => Promise<boolean>;
	getInstances: () => Promise<InstanceRow[]>;
	prepareInstanceForDev: (instance: InstanceRow) => Promise<boolean>;
	resetUserPassword: (instance: InstanceRow) => Promise<boolean>;

	getBuilds: () => Promise<string[]>;
	getAvailableBuilds: () => Promise<BuildRow[]>;
	getAvailableBuild: (build: string, showError?: boolean) => Promise<BuildRow>;
	downloadBuild: (build: BuildRow, extractMsi: boolean) => void;
	deleteBuild: (build: string) => void;

	events: {
		sendMessage(channel: string | undefined, args: unknown[] | undefined): void;
		on(channel: string, func: (...args: unknown[]) => void): (() => void) | undefined;
		once(channel: string, func: (...args: unknown[]) => void): void;
	};
}

declare global {
	interface Window {
		electronAPI: IElectronAPI;
		appSettings: SettingsRow;
	}
}
