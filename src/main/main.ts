/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import fs from 'fs';
import { app, BrowserWindow, shell, ipcMain, Tray, Menu, Event } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Database from 'better-sqlite3';
import cron from 'node-cron';
import MenuBuilder from './menuBuilder';
import IpcBuilder from './ipcBuilder';
import { resolveHtmlPath } from './util';

import GetInstances from './actions/getInstances';
import GetBuilds from './actions/getBuilds';

class AppUpdater {
	constructor() {
		log.transports.file.level = 'info';
		autoUpdater.logger = log;
	}
}

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

let isQuiting: boolean;

// ipcMain.on('ipc', async (event, arg) => {
//   const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
//   console.log(msgTemplate(arg));
//   event.reply('ipc', msgTemplate('pong'));
// });

if (process.env.NODE_ENV === 'production') {
	const sourceMapSupport = require('source-map-support');
	sourceMapSupport.install();
}

const isDevelopment = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

// if (isDevelopment) {
require('electron-debug')();
// }

const installExtensions = async () => {
	const installer = require('electron-devtools-installer');
	const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
	const extensions = ['REACT_DEVELOPER_TOOLS'];

	return installer
		.default(
			extensions.map((name) => installer[name]),
			forceDownload
		)
		.catch(console.log);
};

const RESOURCES_PATH = app.isPackaged ? path.join(process.resourcesPath, 'assets') : path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
	return path.join(RESOURCES_PATH, ...paths);
};

let userDataPath = app.getPath('userData');
const db = new Database(isDevelopment ? './db.sqlite3' : userDataPath + '/db.sqlite3');

db.exec(fs.readFileSync(getAssetPath('sql/create-settings.sql')).toString());
db.exec(fs.readFileSync(getAssetPath('sql/create-instances.sql')).toString());
db.exec(fs.readFileSync(getAssetPath('sql/create-availableBuilds.sql')).toString());

var settings = db.prepare('SELECT * FROM settings').get();
if (!settings) {
	db.prepare(`INSERT INTO settings (hostname, extractMsi) VALUES (?, ?);`).run('localhost', 0);
	settings = db.prepare('SELECT * FROM settings').get();
}

const createWindow = async () => {
	if (isDevelopment) {
		await installExtensions();
	}

	mainWindow = new BrowserWindow({
		show: false,
		width: settings?.windowWidth,
		height: settings?.windowheight,
		icon: getAssetPath('icon.png'),
		// autoHideMenuBar: !isDevelopment,
		// frame: isDevelopment,
		autoHideMenuBar: true,
		frame: false,
		webPreferences: {
			contextIsolation: true,
			preload: app.isPackaged ? path.join(__dirname, 'preload.js') : path.join(__dirname, '../../.erb/dll/preload.js'),
		},
	});

	mainWindow.loadURL(resolveHtmlPath('index.html'));

	mainWindow.on('ready-to-show', () => {
		if (!mainWindow) {
			throw new Error('"mainWindow" is not defined');
		}
		if (process.env.START_MINIMIZED) {
			mainWindow.minimize();
		} else {
			mainWindow.show();
		}
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	app.on('before-quit', () => {
		isQuiting = true;
	});

	mainWindow.on('close', (event: Event) => {
		if (!isQuiting) {
			event.preventDefault();
			mainWindow?.hide();
			event.returnValue = false;
		}
	});

	// const menuBuilder = new MenuBuilder(mainWindow);
	// menuBuilder.buildMenu();

	const ipcBuilder = new IpcBuilder(app, mainWindow, db);
	ipcBuilder.buildIpc();

	// Open urls in the user's browser
	mainWindow.webContents.setWindowOpenHandler((edata) => {
		shell.openExternal(edata.url);
		return { action: 'deny' };
	});

	// remember window size
	mainWindow.on('resize', function () {
		var size = mainWindow?.getSize();
		var width = size?.[0];
		var height = size?.[1];
		if (width != null && height != null) {
			db.prepare(`UPDATE settings SET windowWidth = ${width}, windowheight = ${height};`).run();
		}
	});

	// Remove this if your app does not use auto updates
	// eslint-disable-next-line
	new AppUpdater();
};

/**
 * Add event listeners...
 */

const gotTheLock = app.requestSingleInstanceLock();

app.on('window-all-closed', () => {
	// Respect the OSX convention of having the application in memory even
	// after all windows have been closed
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

if (!gotTheLock) {
	app.quit();
} else {
	app.on('second-instance', (event, commandLine, workingDirectory) => {
		// Someone tried to run a second instance, we should focus our window.
		if (mainWindow) {
			if (mainWindow.isMinimized()) mainWindow.restore();
			mainWindow.focus();
		}
	});

	app
		.whenReady()
		.then(() => {
			tray = new Tray(getAssetPath('icon.ico'));
			const trayMenu = Menu.buildFromTemplate([
				{
					label: 'Quit',
					click: () => {
						mainWindow?.destroy();
						app.quit();
					},
				},
			]);
			tray.setToolTip('Acuamtica Dev Tools');
			tray.setContextMenu(trayMenu);
			tray.on('click', () => {
				mainWindow?.show();
			});

			createWindow();
			app.on('activate', () => {
				// On macOS it's common to re-create a window in the app when the
				// dock icon is clicked and there are no other windows open.
				if (mainWindow === null) createWindow();
			});

			setTimeout(function () {
				if (mainWindow != null) StartTasks(mainWindow);
			}, 5000);
		})
		.catch(console.log);
}

// run tasks every 15 minutes
function StartTasks(mainWindow: BrowserWindow) {
	console.log('Starting tasks');

	GetInstances(mainWindow, db);
	cron.schedule('*/15 * * * *', () => {
		GetInstances(mainWindow, db);
	});

	GetBuilds(mainWindow, db);
	cron.schedule('*/6 * * * *', () => {
		GetBuilds(mainWindow, db);
	});

	autoUpdater.checkForUpdatesAndNotify();
	cron.schedule('0 */12 * * *', () => {
		autoUpdater.checkForUpdatesAndNotify();
	});
}
