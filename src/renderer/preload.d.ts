import { BuildsRow, InstanceRow, SettingsRow } from './types';
import { AlertColor } from '@mui/material/Alert';

export interface IElectronAPI {
	windowEvents: (action: string) => void;
	sendToast: (text: string, severity: AlertColor) => void;
	getAppVersion: () => Promise<string>;
	launchApp: (path: string) => Promise<boolean>;
	openDirectory: (path: string) => Promise<boolean>;

	getSettings: () => Promise<SettingsRow>;
	checkPath: (filePath: string) => Promise<boolean>;
	execSQL: (query: string) => void;

	reloadInstances: () => Promise<boolean>;
	getInstances: () => Promise<InstanceRow[]>;

	getBuilds: () => Promise<string[]>;
	getAvailableBuilds: () => Promise<BuildsRow[]>;

	events: {
		sendMessage(channel: string, args: unknown[]): void;
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
