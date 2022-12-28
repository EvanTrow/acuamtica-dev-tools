import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { InstanceRow, SnackbarAlert } from 'renderer/types';
import { BuildRow } from './actions/downloadBuild';

contextBridge.exposeInMainWorld('electronAPI', {
	events: {
		sendMessage(channel: string, args: unknown[]) {
			ipcRenderer.send(channel, args);
		},
		on(channel: string, func: (...args: unknown[]) => void) {
			const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => func(...args);
			ipcRenderer.on(channel, subscription);

			return () => {
				ipcRenderer.removeListener(channel, subscription);
			};
		},
		once(channel: string, func: (...args: unknown[]) => void) {
			ipcRenderer.once(channel, (_event, ...args) => func(...args));
		},
	},

	windowEvents: (action: string) => ipcRenderer.invoke('windowEvents', action),
	sendToast: (alert: SnackbarAlert) => ipcRenderer.invoke('sendToast', alert),
	getAppVersion: () => ipcRenderer.invoke('getAppVersion'),
	checkForAppUpdate: () => ipcRenderer.invoke('checkForAppUpdate'),
	launchApp: (path: string) => ipcRenderer.invoke('launchApp', path),
	openDirectory: (path: string) => ipcRenderer.invoke('openDirectory', path),

	getSettings: () => ipcRenderer.invoke('getSettings'),
	getAppSettings: () => ipcRenderer.invoke('getAppSettings'),
	setAppSettings: (openAtLogin: boolean) => ipcRenderer.invoke('setAppSettings', openAtLogin),
	checkPath: (filePath: string) => ipcRenderer.invoke('checkPath', filePath),
	execSQL: (query: string) => ipcRenderer.send('execSQL', query),

	reloadInstances: () => ipcRenderer.invoke('reloadInstances'),
	getInstances: () => ipcRenderer.invoke('getInstances'),
	prepareInstanceForDev: (instance: InstanceRow) => ipcRenderer.invoke('prepareInstanceForDev', instance),
	resetUserPassword: (instance: InstanceRow) => ipcRenderer.invoke('resetUserPassword', instance),

	getBuilds: () => ipcRenderer.invoke('getBuilds'),
	getAvailableBuilds: () => ipcRenderer.invoke('getAvailableBuilds'),
	getAvailableBuild: (build: string) => ipcRenderer.invoke('getAvailableBuild', build),
	downloadBuild: (build: BuildRow, extractMsi: boolean) => ipcRenderer.send('downloadBuild', build, extractMsi),
});
