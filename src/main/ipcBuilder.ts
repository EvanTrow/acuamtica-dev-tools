import { BrowserWindow, ipcMain } from 'electron';
import fs from 'fs';
import sqlite from 'better-sqlite3';
import child, { ExecFileException } from 'child_process';

import GetInstances from './actions/getInstances';

import { GetSettings, SendToast } from './helpers';
import { OpenExplorer, WindowsPath } from './helpers';
import DownloadBuild, { BuildRow } from './actions/downloadBuild';
import { AppUpdater } from 'electron-updater';

export default class IpcBuilder {
	app: Electron.App;
	mainWindow: BrowserWindow;
	autoUpdater: AppUpdater;
	db: sqlite.Database;

	constructor(app: Electron.App, mainWindow: BrowserWindow, autoUpdater: AppUpdater, db: sqlite.Database) {
		this.app = app;
		this.mainWindow = mainWindow;
		this.autoUpdater = autoUpdater;
		this.db = db;
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

		ipcMain.handle('checkForAppUpdate', async (event, args) => {
			SendToast(this.mainWindow, {
				text: 'Checking for updates...',
				options: {
					variant: 'info',
				},
			});

			this.autoUpdater.checkForUpdates().then(() => {
				this.autoUpdater.on('update-not-available', (info) => {
					SendToast(this.mainWindow, {
						text: `You're already running the lastest version: ${info.version}`,
						options: {
							variant: 'success',
						},
					});
					this.autoUpdater.off('update-not-available', () => {});
				});
			});
		});

		ipcMain.on('restartToUpdate', async (event, args) => {
			console.log('restartToUpdate');
			this.autoUpdater.quitAndInstall(false, true);
		});

		ipcMain.handle('launchApp', async (event, path) => {
			path = WindowsPath(path);
			return new Promise(async (resolve, reject) => {
				if (fs.existsSync(path)) {
					child.execFile(path, (err: ExecFileException | null, stdout: string, stderr: string) => {
						if (err) {
							SendToast(this.mainWindow, {
								text: 'IPC Error! launchApp > ' + err.message,
								options: {
									variant: 'error',
								},
							});

							resolve(true);
							return;
						}
						resolve(true);
					});
				} else {
					SendToast(this.mainWindow, {
						text: `IPC Error! launchApp > path (${path}) does not exists.`,
						options: {
							variant: 'error',
						},
					});

					resolve(true);
				}
			});
		});

		ipcMain.handle('sendToast', async (event, alert) => {
			console.log(alert);
			SendToast(this.mainWindow, alert);
		});

		ipcMain.handle('openDirectory', async (event, path) => {
			path = WindowsPath(path);
			return new Promise(async (resolve, reject) => {
				if (fs.existsSync(path)) {
					await OpenExplorer(path);
					resolve(true);
				} else {
					SendToast(this.mainWindow, {
						text: `IPC Error! openDirectory > directory (${path}) does not exists.`,
						options: {
							variant: 'error',
						},
					});

					resolve(true);
				}
			});
		});

		ipcMain.handle('getSettings', async (event) => {
			return new Promise((resolve, reject) => {
				try {
					const settings = GetSettings(this.db, this.mainWindow);
					resolve(settings);
				} catch (e) {
					reject((e as Error).message.toString());
				}
			});
		});

		ipcMain.handle('checkPath', (event, arg) => {
			try {
				return fs.existsSync(arg);
			} catch (e) {
				SendToast(this.mainWindow, {
					text: 'IPC Error! checkPath > ' + (e as Error).message,
					options: {
						variant: 'error',
					},
				});
				return false;
			}
		});

		ipcMain.on('execSQL', (event, query) => {
			try {
				this.db.prepare(query).run();
			} catch (e) {
				SendToast(this.mainWindow, {
					text: 'IPC Error! sql > ' + (e as Error).message,
					options: {
						variant: 'error',
					},
				});
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
					SendToast(this.mainWindow, {
						text: 'IPC Error! getInstances > ' + (e as Error).message,
						options: {
							variant: 'error',
						},
					});
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
					SendToast(this.mainWindow, {
						text: 'IPC Error! sql > ' + (e as Error).message,
						options: {
							variant: 'error',
						},
					});
				}
			});
		});

		ipcMain.handle('getAvailableBuilds', async (event) => {
			return new Promise(async (resolve, reject) => {
				try {
					const builds = this.db.prepare('SELECT * FROM availableBuilds').all();
					resolve(builds);
				} catch (e) {
					SendToast(this.mainWindow, {
						text: 'IPC Error! getAvailableBuilds > ' + (e as Error).message,
						options: {
							variant: 'error',
						},
					});
					reject((e as Error).message.toString());
				}
			});
		});

		ipcMain.handle('getAvailableBuild', async (event, build) => {
			return new Promise(async (resolve, reject) => {
				try {
					const b = this.db.prepare(`SELECT * FROM availableBuilds where build=?`).get(build);

					if (!b) {
						var msg = `IPC Error! getAvailableBuild > build: ${build} does not exist.`;
						SendToast(this.mainWindow, {
							text: msg,
							options: {
								variant: 'error',
							},
						});
						reject(msg);
					} else {
						resolve(b);
					}

					//
				} catch (e) {
					console.log(e);
					SendToast(this.mainWindow, {
						text: 'IPC Error! getBuild > ' + (e as Error).message,
						options: {
							variant: 'error',
						},
					});
					reject((e as Error).message.toString());
				}
			});
		});

		ipcMain.on('downloadBuild', (event, build, extractMsi) => {
			try {
				DownloadBuild(this.db, this.mainWindow, event, build as BuildRow, extractMsi);
			} catch (e) {
				SendToast(this.mainWindow, {
					text: 'IPC Error! sql > ' + (e as Error).message,
					options: {
						variant: 'error',
					},
				});
			}
		});
	}
}
