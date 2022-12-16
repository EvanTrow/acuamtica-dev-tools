import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

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
	getAppVersion: () => ipcRenderer.invoke('getAppVersion'),
	launchApp: (path: string) => ipcRenderer.invoke('launchApp', path),
	openDirectory: (path: string) => ipcRenderer.invoke('openDirectory', path),

	getSettings: () => ipcRenderer.invoke('getSettings'),
	checkPath: (filePath: string) => ipcRenderer.invoke('checkPath', filePath),
	execSQL: (query: string) => ipcRenderer.send('execSQL', query),

	reloadInstances: () => ipcRenderer.invoke('reloadInstances'),
	getInstances: () => ipcRenderer.invoke('getInstances'),

	getBuilds: () => ipcRenderer.invoke('getBuilds'),
});
