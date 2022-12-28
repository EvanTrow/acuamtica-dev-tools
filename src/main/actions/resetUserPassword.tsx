import { BrowserWindow } from 'electron';

import sqlite from 'better-sqlite3';
import * as sql from 'mssql';

import path from 'path';
import fs from 'fs';

import { GetSettings, SendToast, WindowsPath } from '../helpers';
import { InstanceRow, SettingsRow } from 'renderer/types';
import AcumaticaConfig from 'main/AcumaticaConfig';

import convert from 'xml-js';
const xmlOptions = { compact: true, spaces: 4 };

export default function resetUserPassword(mainWindow: BrowserWindow, database: sqlite.Database, instance: InstanceRow) {
	start(mainWindow, database, instance);
}

async function start(mainWindow: BrowserWindow, database: sqlite.Database, instance: InstanceRow) {
	const sendError = (text: string) => {
		SendToast(mainWindow, {
			text: text,
			options: {
				variant: 'error',
			},
		});
	};

	try {
		const settings = GetSettings(database, mainWindow);
		if (!settings) {
			return;
		}

		// Parse Web.config
		var acuConfig = (await loadXml(WindowsPath(path.join(instance.installPath, 'Web.config')))) as unknown as AcumaticaConfig;
		let connectionString: string | undefined = acuConfig.configuration.connectionStrings.add.find((c) => c._attributes.name == 'ProjectX')?._attributes.connectionString;

		if (connectionString) {
			const pool = await sql.connect(`${connectionString};Encrypt=true;trustServerCertificate=true`);
			const request = new sql.Request(pool);

			var result: any;
			if (settings.resetPasswordAll) {
				result = await request.query(`UPDATE Users SET Password = '${settings.resetPassword}' WHERE CompanyID > 1`);
			} else {
				result = await request.query(`UPDATE Users SET Password = '${settings.resetPassword}' WHERE CompanyID > 1 AND Username = 'admin'`);
			}
			await pool.close();

			SendToast(mainWindow, {
				text: `Reset ${result?.rowsAffected?.[0]} user password${result?.rowsAffected?.[0] > 1 ? 's' : ''}!`,
				options: {
					variant: 'success',
				},
			});
		} else {
			SendToast(mainWindow, {
				text: `Unabled to connect to database!`,
				options: {
					variant: 'error',
				},
			});
		}
	} catch (e) {
		console.log(e);
		sendError('Error preparing instance for development! > ' + (e as Error).message);
	}
}

async function loadXml(path: string) {
	const data = await fs.promises.readFile(path, 'utf8');
	return convert.xml2js(data, xmlOptions);
}
