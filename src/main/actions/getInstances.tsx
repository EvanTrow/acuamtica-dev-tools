import { BrowserWindow } from 'electron';
import sqlite from 'better-sqlite3';

import path from 'path';
import fs from 'fs';

import regedit from 'regedit';
import * as sql from 'mssql';

import convert from 'xml-js';
import { getAssetPath } from '../main';
import AcumaticaConfig from 'main/AcumaticaConfig';
import { InstanceRow } from 'renderer/types';
import { asyncForEach, GetSettings } from '../helpers';
const xmlOptions = { compact: true, spaces: 4 };

const { SendToast, WindowsPath } = require('./../helpers');

interface RegistryResult {
	exists: boolean;
	keys: string[];
	values: {
		[key: string]: {
			type: string;
			value: string;
		};
	};
}

interface AcuSite {
	name: string;
	path: string;
	installPath: string;
	iisSite: string;
	iisType: string;
}

interface AcuDb {
	dbName: string;
	dbSize: number;
	dbLogSize: number;
	dbTotalSize: number;
}

export default async function GetInstances(mainWindow: BrowserWindow, database: sqlite.Database) {
	try {
		const sendError = (text: string) => {
			SendToast(mainWindow, {
				text: text,
				options: {
					variant: 'error',
				},
			});
		};

		const settings = GetSettings(database, mainWindow);
		if (!settings) {
			return;
		}

		regedit.setExternalVBSLocation(getAssetPath('regedit-vbs'));

		const acuRegKey: string = 'HKLM\\SOFTWARE\\Acumatica ERP';
		var result = (await regedit.promisified.list([acuRegKey]))[acuRegKey] as unknown as RegistryResult;

		if (!result.exists) {
			const msg = 'No Acumatica instance found in registry!';
			console.log(msg);
			sendError(msg);
			return;
		}

		let instances: InstanceRow[] = [];
		await asyncForEach(result.keys, async (key) => {
			var result = (await regedit.promisified.list([acuRegKey + '\\' + key]))[acuRegKey + '\\' + key] as unknown as RegistryResult;

			if (!result.exists) {
				const msg = `Registry issue with ${key}!`;
				console.log(msg);
				sendError(msg);
				return;
			}

			let site: AcuSite = {
				name: result.values['VirtDirName'].value,
				path: result.values['VirtDirName'].value,
				installPath: result.values['Path'].value,
				iisSite: result.values['WebSiteName'].value,
				iisType: result.values['Type'].value,
			};

			// Parse Web.config
			var acuConfig = (await loadXml(WindowsPath(path.join(site.installPath, 'Web.config')))) as unknown as AcumaticaConfig;

			// Get version and database connection info
			let acumaticaVersion: string | undefined = acuConfig.configuration.appSettings.add.find((a) => a._attributes.key == 'Version')?._attributes.value;
			let connectionString: string | undefined = acuConfig.configuration.connectionStrings.add.find((c) => c._attributes.name == 'ProjectX')?._attributes.connectionString;

			if (!acumaticaVersion) {
				const msg = `Unabled to parse Web.config for ${site.name}!`;
				console.log(msg);
				sendError(msg);
			}

			// Get database info
			var db: AcuDb | undefined = undefined;
			if (connectionString) {
				const pool = await sql.connect(`${connectionString};Encrypt=true;trustServerCertificate=true`);
				const request = new sql.Request(pool);
				const result = await request.query(`SELECT
						dbName = DB_NAME(),
						dbSize = CAST(SUM(CASE WHEN type_desc = 'ROWS' THEN size END) * 8. / 1024 / 1024 AS DECIMAL(12,4)),
						dbLogSize = CAST(SUM(CASE WHEN type_desc = 'LOG' THEN size END) * 8. / 1024 / 1024 AS DECIMAL(12,4)),
						dbTotalSize = CAST(SUM(size) * 8. / 1024 / 1024 AS DECIMAL(12,4))
						FROM sys.master_files WITH(NOWAIT)
						WHERE database_id = DB_ID()
						GROUP BY database_id`);
				await pool.close();
				db = result?.recordset?.[0] as AcuDb;
			}

			let instance: InstanceRow = {
				name: site.name,
				path: site.path,
				installPath: site.installPath,
				version: acumaticaVersion,
				dbName: db?.dbName,
				dbSize: db?.dbSize,
				dbLogSize: db?.dbLogSize,
				dbTotalSize: db?.dbTotalSize,
			};

			instances.push(instance);
		});

		// clear existing sites
		database.prepare('DELETE FROM instances').run();

		// insert sites
		const insert = database.prepare(`INSERT INTO instances (name, path, version, installPath, dbName, dbSize, dbLogSize, dbTotalSize)
		VALUES (@name, @path, @version, @installPath, @dbName, @dbSize, @dbLogSize, @dbTotalSize)`);
		const insertMany = database.transaction((sites) => {
			for (const site of sites) insert.run(site);
		});
		insertMany(instances);

		console.log(`Found ${instances.length} instances.`);
	} catch (err) {
		console.log(err);
		SendToast(mainWindow, {
			text: 'Error querying Acuamtica instances! > ' + (err as Error).message,
			options: {
				variant: 'error',
			},
		});
	}
}

async function loadXml(path: string) {
	const data = await fs.promises.readFile(path, 'utf8');
	return convert.xml2js(data, xmlOptions);
}
