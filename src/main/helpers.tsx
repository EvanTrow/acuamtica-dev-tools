import { BrowserWindow } from 'electron';
import sqlite from 'better-sqlite3';

import { SettingsRow, SnackbarAlert } from 'renderer/types';

export function GetSettings(db: sqlite.Database, mainWindow?: BrowserWindow) {
	try {
		let data = db.prepare('SELECT * FROM settings').get();

		let settings: SettingsRow = {
			...data,
			menuOpen: data.menuOpen == 1 ? true : false,
			extractMsi: data.extractMsi == 1 ? true : false,
			startMinimized: data.startMinimized == 1 ? true : false,
			minimizeToTray: data.minimizeToTray == 1 ? true : false,
			resetPasswordAll: data.resetPasswordAll == 1 ? true : false,
		};

		return settings;
	} catch (e) {
		if (mainWindow) {
			SendToast(mainWindow, {
				text: 'Unable to get settings > ' + (e as Error).message,
				options: {
					variant: 'error',
				},
			});
		} else {
			console.log(e);
		}

		return undefined;
	}
}

export function SendToast(mainWindow: BrowserWindow, alert: SnackbarAlert) {
	mainWindow.webContents.send('alert', {
		text: alert.text,
		options: {
			...alert.options,
		},
		action: alert.action,
	});
}

export async function OpenExplorer(path: string) {
	const { spawn } = require('child_process');
	const child = spawn('explorer', [path]);

	let data = '';
	for await (const chunk of child.stdout) {
		//console.log('stdout chunk: '+chunk);
		data += chunk;
	}
	let error = '';
	for await (const chunk of child.stderr) {
		console.error('stderr chunk: ' + chunk);
		error += chunk;
	}
	await new Promise((resolve, reject) => {
		child.on('close', resolve);
	});

	return data;
}

export function WindowsPath(path: string): string {
	return path.replaceAll('/', '\\');
}

export async function asyncForEach(array: any[], callback: (arg0: any, arg1: number, arg2: any[]) => any) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}
