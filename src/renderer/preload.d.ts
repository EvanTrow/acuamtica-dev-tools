import { InstanceRow, SettingsRow } from './types';

export interface IElectronAPI {
	windowEvents: (action: string) => void;
	getAppVersion: () => Promise<string>;
	launchApp: (path: string) => Promise<boolean>;
	openDirectory: (path: string) => Promise<boolean>;

	getSettings: () => Promise<SettingsRow>;
	checkPath: (filePath: string) => Promise<boolean>;
	execSQL: (query: string) => void;

	reloadInstances: () => Promise<boolean>;
	getInstances: () => Promise<InstanceRow[]>;

	getBuilds: () => Promise<string[]>;

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
