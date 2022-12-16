import { BrowserWindow, ipcMain } from 'electron';
import fs from 'fs';
import sqlite from 'better-sqlite3';
import child, { ExecFileException } from 'child_process';

import GetInstances from './actions/getInstances';

import { SendToast } from './helpers';
import { OpenExplorer, WindowsPath } from './actions/helpers';

export default class IpcBuilder {
	app: Electron.App;
	db: sqlite.Database;
	mainWindow: BrowserWindow;

	constructor(app: Electron.App, mainWindow: BrowserWindow, db: sqlite.Database) {
		this.app = app;
		this.db = db;
		this.mainWindow = mainWindow;
	}

	buildIpc() {
		ipcMain.handle('windowEvents', (event, action) => {
			console.log(action);
			switch (action) {
				case 'close':
					this.mainWindow.hide();
					break;
				case 'maximize':
					if (this.mainWindow.isMaximized()) {
						this.mainWindow.unmaximize();
					} else {
						this.mainWindow.maximize();
					}
					break;
				case 'minimize':
					this.mainWindow.minimize();
					break;
			}
			return;
		});

		ipcMain.handle('getAppVersion', async (event) => {
			return new Promise((resolve, reject) => {
				resolve(this.app.getVersion());
			});
		});

		ipcMain.handle('launchApp', async (event, path) => {
			path = WindowsPath(path);
			return new Promise(async (resolve, reject) => {
				if (fs.existsSync(path)) {
					child.execFile(path, (err: ExecFileException | null, stdout: string, stderr: string) => {
						if (err) {
							SendToast(this.mainWindow, 'IPC Error! launchApp > ' + err.message, 'error');
							resolve(true);
							return;
						}
						resolve(true);
					});
				} else {
					SendToast(this.mainWindow, `IPC Error! launchApp > path (${path}) does not exists.`, 'error');

					resolve(true);
				}
			});
		});

		ipcMain.handle('sendToast', async (event, text, severity) => {
			SendToast(this.mainWindow, text, severity);
		});

		ipcMain.handle('openDirectory', async (event, path) => {
			path = WindowsPath(path);
			return new Promise(async (resolve, reject) => {
				if (fs.existsSync(path)) {
					await OpenExplorer(path);
					resolve(true);
				} else {
					SendToast(this.mainWindow, `IPC Error! openDirectory > directory (${path}) does not exists.`, 'error');

					resolve(true);
				}
			});
		});

		ipcMain.handle('getSettings', async (event) => {
			return new Promise((resolve, reject) => {
				try {
					const settings = this.db.prepare('SELECT * FROM settings').get();
					resolve({
						...settings,
						extractMsi: settings.extractMsi == 1 ? true : false,
					});
				} catch (e) {
					SendToast(this.mainWindow, 'IPC Error! getSettings > ' + (e as Error).message, 'error');
					reject((e as Error).message.toString());
				}
			});
		});

		ipcMain.handle('checkPath', (event, arg) => {
			try {
				return fs.existsSync(arg);
			} catch (e) {
				SendToast(this.mainWindow, 'IPC Error! checkPath > ' + (e as Error).message, 'error');
				return false;
			}
		});

		ipcMain.on('execSQL', (event, query) => {
			try {
				this.db.prepare(query).run();
			} catch (e) {
				SendToast(this.mainWindow, 'IPC Error! sql > ' + (e as Error).message, 'error');
			}
		});

		ipcMain.handle('reloadInstances', async (event) => {
			return new Promise(async (resolve, reject) => {
				await GetInstances(this.mainWindow, this.db);
				resolve(true);
			});
		});

		ipcMain.handle('getInstances', async (event) => {
			return new Promise((resolve, reject) => {
				try {
					const instances = this.db.prepare('SELECT * FROM instances').all();
					resolve(instances);
				} catch (e) {
					SendToast(this.mainWindow, 'IPC Error! getInstances > ' + (e as Error).message, 'error');
					reject((e as Error).message.toString());
				}
			});
		});

		ipcMain.handle('getBuilds', async (event) => {
			return new Promise(async (resolve, reject) => {
				try {
					const settings = this.db.prepare('SELECT * FROM settings').get();

					let folders: string[] = await fs.promises.readdir(settings.buildLocation);

					resolve(folders);
				} catch (e) {
					console.log(e);
					SendToast(this.mainWindow, 'IPC Error! sql > ' + (e as Error).message, 'error');
				}
			});
		});

		ipcMain.handle('getAvailableBuilds', async (event) => {
			return new Promise(async (resolve, reject) => {
				try {
					const builds = this.db.prepare('SELECT * FROM availableBuilds').all();
					resolve(builds);
				} catch (e) {
					SendToast(this.mainWindow, 'IPC Error! getAvailableBuilds > ' + (e as Error).message, 'error');
					reject((e as Error).message.toString());
				}
			});
		});
	}
}
