const fs = require('fs');
const fsp = require('fs').promises;

const sql = require('mssql');
const convert = require('xml-js');
const xmlOptions = { compact: true, spaces: 4 };

const { GetSettings, SendToast } = require('../helpers');

export default async function GetInstances(mainWindow, database) {
	try {
		var settings = await GetSettings(database, mainWindow).catch((err) => {
			console.log('settings err:' + err);
			SendToast(mainWindow, 'Error querying Acuamtica instances (setttings) > ' + err, 'error');
		});
		if (!settings) {
			return;
		}

		console.log('Getting Acumatica Instance Data');
		var sitesData = await loadXml('C:\\Windows\\System32\\inetsrv\\config\\applicationHost.config');
		sitesData = sitesData.configuration['system.applicationHost'].sites.site.application;

		var sites = [];

		await asyncForEach(sitesData, async (site, i) => {
			var acumaticaVersion = 'N/A';
			var db = null;

			if (site.virtualDirectory._attributes.physicalPath?.toLocaleLowerCase().startsWith(settings.instanceLocation?.toLocaleLowerCase())) {
				var acuConfig = await loadXml(`${site.virtualDirectory._attributes.physicalPath}Web.config`);
				acumaticaVersion = acuConfig.configuration.appSettings.add.find((a) => a._attributes.key == 'Version')._attributes.value;

				try {
					var connectionString = acuConfig.configuration.connectionStrings.add.find((c) => c._attributes.name == 'ProjectX')._attributes.connectionString;

					await sql.connect(`${connectionString};Encrypt=true;trustServerCertificate=true`);
					const result = await sql.query(`SELECT 
									name = DB_NAME(),
									log = CAST(SUM(CASE WHEN type_desc = 'LOG' THEN size END) * 8. / 1024 / 1024 AS DECIMAL(12,4)),
									db = CAST(SUM(CASE WHEN type_desc = 'ROWS' THEN size END) * 8. / 1024 / 1024 AS DECIMAL(12,4)),
									total = CAST(SUM(size) * 8. / 1024 / 1024 AS DECIMAL(12,4))
								FROM sys.master_files WITH(NOWAIT)
								WHERE database_id = DB_ID()
								GROUP BY database_id`);
					await sql.close();
					db = result?.recordset?.[0];
				} catch (error) {}

				sites.push({
					name: site._attributes.applicationPool,
					path: site._attributes.path,
					version: acumaticaVersion,
					installPath: site.virtualDirectory._attributes.physicalPath,
					database: db,
				});
			}
		});

		sites.forEach((site) => {
			console.log('Updating instance:', site.name);

			if (typeof site.database?.name == 'undefined') {
				SendToast(mainWindow, 'Unable to query database for ' + site.name, 'warning');
			}

			database
				.prepare(
					`INSERT OR REPLACE INTO instances (name, path, installPath, version, dbName, dbSize, dbLogSize, dbTotalSize) 
	  VALUES ("${site.name}", "${site.path}", "${site.installPath}", "${site.version}", "${site.database?.name || ''}", "${site.database?.db || 0}", "${site.database?.log || 0}", "${
						site.database?.total || 0
					}");`
				)
				.run()
				.finalize();
		});

		console.log('Complete.');
	} catch (error) {
		console.log(error);

		SendToast(mainWindow, 'Error querying Acuamtica instances! > ' + error.message, 'error');
	}
}

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}
async function loadXml(path) {
	const data = await fsp.readFile(path, 'utf8');
	return convert.xml2js(data, xmlOptions);
}
async function loadHtml(path) {
	const data = await fsp.readFile(path, 'utf8');
	return data;
}
function dynamicSort(property) {
	var sortOrder = 1;
	if (property[0] === '-') {
		sortOrder = -1;
		property = property.substr(1);
	}
	return function (a, b) {
		/* next line works with strings and numbers,
		 * and you may want to customize it to your needs
		 */
		var result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
		return result * sortOrder;
	};
}
