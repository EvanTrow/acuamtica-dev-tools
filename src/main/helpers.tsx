import { BrowserWindow } from 'electron';
import sqlite from 'better-sqlite3';

import { AlertColor } from '@mui/material/Alert';

export function GetSettings(db: sqlite.Database, mainWindow: BrowserWindow) {
	try {
		const settings = db.prepare('SELECT * FROM settings').get();
		return {
			...settings,
			extractMsi: settings.extractMsi == 1 ? true : false,
		};
	} catch (e) {
		SendToast(mainWindow, 'Unable to get settings > ' + (e as Error).message, 'error');
		return undefined;
	}
}

export function SendToast(mainWindow: BrowserWindow, message: string, severity: AlertColor) {
	mainWindow.webContents.send('alert', {
		open: true,
		text: message,
		severity: severity,
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
