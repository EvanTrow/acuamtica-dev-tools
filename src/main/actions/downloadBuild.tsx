import { app, BrowserWindow, IpcMainEvent } from 'electron';

import fs from 'fs-extra';
import request from 'request';
import path from 'path';
import sqlite from 'better-sqlite3';

import { GetSettings, SendToast, WindowsPath } from './../helpers';
import { getAssetPath } from '../main';

export type BuildRow = {
	build: string;
	version: string;
	path: string;
};

export default function DownloadBuild(database: sqlite.Database, mainWindow: BrowserWindow, event: IpcMainEvent, selectedBuild: BuildRow, extractMsi: boolean) {
	start(database, mainWindow, event, selectedBuild, extractMsi);
}

async function start(database: sqlite.Database, mainWindow: BrowserWindow, event: IpcMainEvent, selectedBuild: BuildRow, extractMsi: boolean) {
	try {
		console.log(`Downloading build`, selectedBuild);

		const settings = GetSettings(database, mainWindow);
		if (!settings) {
			return;
		}

		downloadMSI(selectedBuild.path, event, async (err: any) => {
			if (err) throw err;

			console.log('Downloaded!');

			if (extractMsi == true) {
				console.log('Extracting...');
				var spawn = require('child_process').spawn,
					child;
				child = spawn(WindowsPath(getAssetPath('lessmsi\\lessmsi.exe')), ['x', 'AcumaticaERPInstall.msi', settings.buildLocation + '\\' + selectedBuild.build]);
				child.stdout.on('data', function (data: { toString: () => { (): any; new (): any; split: { (arg0: string): { match: (arg0: RegExp) => any[] }[]; new (): any } } }) {
					try {
						var fileCount = data.toString().split('/')[1].match(/\d+/)[0];
						var activeFile = data.toString().split('/')[0].match(/\d+/)[0];

						event.reply('downloadBuild-extract', [fileCount, activeFile]);
					} catch (e) {
						//console.log(e);
					}
				});
				child.stderr.on('data', function (data: string) {
					console.log('Powershell Error: ' + data);
					event.reply('downloadBuild-error', ['Powershell Error: ' + data]);
				});
				child.on('exit', async () => {
					console.log('Extracted!');

					event.reply('downloadBuild-status', ['Moving Files...']);
					console.log('Moving Files...');
					if (fs.existsSync(`AcumaticaERPInstall/SourceDir/Acumatica ERP`)) {
						fs.move(`AcumaticaERPInstall/SourceDir/Acumatica ERP`, `${settings.buildLocation}/${selectedBuild.build}`);
					} else {
						fs.move(`AcumaticaERPInstall/SourceDir`, `${settings.buildLocation}/${selectedBuild.build}`);
					}
					console.log('Removing temp files...');
					event.reply('downloadBuild-status', ['Removing temp files...']);

					fs.rm(`AcumaticaERPInstall`, { recursive: true, force: true });
					fs.rm(`AcumaticaERPInstall.msi`, { recursive: true, force: true });

					console.log(`COMPLETE! - AcumaticaERPInstall-${selectedBuild.build}.msi`);
					event.reply('downloadBuild-complete', [`${settings.buildLocation}/${selectedBuild.build}`]);
				});
				child.stdin.end(); //end input
			} else {
				fs.move(`AcumaticaERPInstall.msi`, path.join(app.getPath('downloads'), `AcumaticaERPInstall-${selectedBuild.build}.msi`));
				console.log(`COMPLETE! - AcumaticaERPInstall-${selectedBuild.build}.msi`);
				event.reply('downloadBuild-complete', [app.getPath('downloads')]);
			}
		});
	} catch (e) {
		console.log(e);

		SendToast(mainWindow, {
			text: 'Error querying Acuamtica instances! > ' + (e as Error).message,
			options: {
				variant: 'error',
			},
		});
	}
}

async function downloadMSI(url: string, event: IpcMainEvent, callback: any) {
	var filename = 'AcumaticaERPInstall.msi';
	const file = fs.createWriteStream(filename);
	let receivedBytes = 0;

	let totalBytes = 0;

	request
		.get(url)
		.on('response', (response) => {
			if (response.statusCode !== 200) {
				return callback('Response status was ' + response.statusCode);
			}

			totalBytes = parseInt(String(response.headers['content-length']));
			// progressBar.start(totalBytes, 0);
			event.reply('downloadBuild-download', [totalBytes, 0]);
		})
		.on('data', (chunk) => {
			receivedBytes += chunk.length;

			event.reply('downloadBuild-download', [totalBytes, receivedBytes]);
		})
		.pipe(file)
		.on('error', (err) => {
			fs.unlink(filename);
			event.reply('downloadBuild-error', [err.message]);
			return callback(err.message);
		});

	file.on('finish', () => {
		// progressBar.stop();
		file.close(callback);
	});

	file.on('error', (err) => {
		fs.unlink(filename);
		// progressBar.stop();
		return callback(err.message);
	});
}
