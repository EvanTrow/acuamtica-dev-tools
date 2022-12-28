import { app, BrowserWindow, IpcMainEvent } from 'electron';

import fs from 'fs-extra';
import path from 'path';
import sqlite from 'better-sqlite3';

import { SendToast, WindowsPath } from '../helpers';
import { InstanceRow } from 'renderer/types';

import xml2js, { parseString } from 'xml2js';

export default function prepareInstanceForDev(mainWindow: BrowserWindow, instance: InstanceRow) {
	start(mainWindow, instance);
}

async function start(mainWindow: BrowserWindow, instance: InstanceRow) {
	const sendError = (text: string) => {
		SendToast(mainWindow, {
			text: text,
			options: {
				variant: 'error',
			},
		});
	};

	try {
		if (!fs.existsSync(WindowsPath(path.join(instance.installPath, 'Web.config.adt-bak')))) {
			fs.copy(WindowsPath(path.join(instance.installPath, 'Web.config')), WindowsPath(path.join(instance.installPath, 'Web.config.adt-bak')));
		}

		fs.readFile(WindowsPath(path.join(instance.installPath, 'Web.config')), 'utf8', (err, data) => {
			if (err) {
				console.log(err);
				sendError('Error preparing instance for development! > ' + err.message);
				return;
			}

			parseString(data, function (err, result) {
				if (err) {
					console.log(err);
					sendError('Error preparing instance for development! > ' + err.message);
					return;
				}

				let errors: string[] = [];

				var json = result;

				// set CompilePages: False
				try {
					var compilePagesIndex = json.configuration.appSettings[0].add.findIndex((x: any) => x['$'].key == 'CompilePages');
					json.configuration.appSettings[0].add[compilePagesIndex]['$'].value = 'False';
				} catch (e) {
					console.log(e);
					errors.push('CompilePages = false');
				}

				// set optimizeCompilations: True
				try {
					json.configuration['system.web'][0].compilation[0]['$'].optimizeCompilations = 'True';
				} catch (e) {
					console.log(e);
					errors.push('optimizeCompilations = True');
				}

				var builder = new xml2js.Builder();
				var xml = builder.buildObject(json);

				fs.writeFile(WindowsPath(path.join(instance.installPath, 'Web.config')), xml, (err) => {
					if (err) {
						console.log(err);
						sendError('Error preparing instance for development! > ' + err.message);
						return;
					}

					console.log('Updated');

					if (errors.length > 0) {
						SendToast(mainWindow, {
							text: `Updated ${WindowsPath(path.join(instance.installPath, 'Web.config'))} file but was unabled to set: ${errors.join(', ')}`,
							options: {
								variant: 'warning',
							},
						});
					} else {
						SendToast(mainWindow, {
							text: `Updated ${WindowsPath(path.join(instance.installPath, 'Web.config'))} file!`,
							options: {
								variant: 'success',
							},
						});
					}
				});
			});
		});
	} catch (e) {
		console.log(e);
		sendError('Error preparing instance for development! > ' + (e as Error).message);
	}
}
