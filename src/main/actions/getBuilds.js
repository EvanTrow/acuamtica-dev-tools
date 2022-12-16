const request = require('request');
const convert = require('xml-js');
const naturalSort = require('javascript-natural-sort');

const { SendToast } = require('../helpers');

var builds = [];
var versions = [];

var xmlOptions = { compact: true, spaces: 4 };

export default function GetBuilds(mainWindow, database) {
	start(mainWindow, database);
}

async function start(mainWindow, database) {
	try {
		console.log('Getting Acumatica Builds Data');

		await WebRequest(`http://acumatica-builds.s3.amazonaws.com/?delimiter=/&prefix=builds/`)
			.then(async (body) => {
				await asyncForEach(convert.xml2js(body, xmlOptions).ListBucketResult.CommonPrefixes, async (folder, i) => {
					if (/^(\d*\.)\d.*$/.test(folder.Prefix._text.replace('builds/', '').replace('/', ''))) {
						var version = folder.Prefix._text.replace('builds/', '').replace('/', '');

						versions.push(version);
					}
				});

				// sort versions
				versions = versions.sort(function (a, b) {
					return parseFloat(b) - parseFloat(a);
				});

				await asyncForEach(versions, async (version, i) => {
					var verionBuilds = [];
					var verionBuildz = [];

					await WebRequest(`http://acumatica-builds.s3.amazonaws.com/?delimiter=/&prefix=builds/${version}/`)
						.then((body) => {
							convert.xml2js(body, xmlOptions).ListBucketResult.CommonPrefixes.forEach((build) => {
								if (/^\d{1,}\.\d{1,}\.\d{1,}/.test(build.Prefix._text.replace('builds/', '').replace('/', ''))) {
									verionBuilds.push({
										version: version,
										build: build.Prefix._text.replace(`builds/${version}/`, '').replace('/', ''),
										path: `http://acumatica-builds.s3.amazonaws.com/${build.Prefix._text}AcumaticaERP/AcumaticaERPInstall.msi`,
									});
									verionBuildz.push(build.Prefix._text.replace(`builds/${version}/`, '').replace('/', ''));
								}
							});
						})
						.catch((err) => {
							console.error(err);
							SendToast(mainWindow, 'Error getting Acumatica Builds > ' + err.message, 'error');
						});

					verionBuildz = verionBuildz.sort(naturalSort).reverse();

					verionBuildz.forEach((build) => {
						builds.push(verionBuilds.filter((b) => b.build == build)[0]);
					});
				});
			})
			.catch((err) => {
				console.error(err);
				SendToast(mainWindow, 'Error getting Acumatica Builds > ' + err.message, 'error');
			});

		const insert = database.prepare(`INSERT OR REPLACE INTO availableBuilds (build, version, path) 
		VALUES (@build, @version, @path)`);
		const insertMany = database.transaction((builds) => {
			for (const build of builds) insert.run(build);
		});
		insertMany(builds);

		console.log('Complete.', builds.length);
	} catch (error) {
		console.log(error);
		SendToast(mainWindow, 'Error querying Acuamtica instances! > ' + error.message, 'error');
	}
}

function WebRequest(url) {
	return new Promise(function (resolve, reject) {
		request(url, function (error, res, body) {
			if (!error && res.statusCode === 200) {
				resolve(body);
			} else {
				reject(error);
			}
		});
	});
}

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}
