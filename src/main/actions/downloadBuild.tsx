const request = require('request');
const convert = require('xml-js');
const fs = require('fs-extra');
const naturalSort = require('javascript-natural-sort');
const stringSimilarity = require('string-similarity');
const prompt = require('prompt-sync')({ sigint: true });
const colors = require('colors');
const Table = require('cli-table');
const cliProgress = require('cli-progress');

var xmlOptions = { compact: true, spaces: 4 };

async function start(selectedBuild) {
	console.log(colors.green.bold(`Selected build: `), selectedBuild);

	if (config.extractMsi == true) {
		if (fs.existsSync(`${config.location}/${selectedBuild.build}`)) {
			const overwriteExisting = prompt(colors.yellow.bold(`Build is already loaded, OVERWRITE existing files in [ ${config.location}\\${selectedBuild.build} ] ?  (y/N) : `));
			if (overwriteExisting != 'y' && overwriteExisting != 'Y') {
				console.log('Opening destination folder...'.green);
				await openExplorer(`${config.location}\\${selectedBuild.build}`);
				process.exit(0);
			} else {
				console.log(`Deleting existing files in ${config.location}\\${selectedBuild.build}...`.yellow);
				fs.rmSync(`${config.location}/${selectedBuild.build}`, { recursive: true, force: true });
				console.log('Done.'.green);
			}
		}
	}

	downloadMSI(`http://acumatica-builds.s3.amazonaws.com/${selectedBuild.path}AcumaticaERP/AcumaticaERPInstall.msi`, async (err) => {
		if (err) throw err;

		console.log('Downloaded!'.green);

		if (config.extractMsi == true) {
			const progressBar = new cliProgress.SingleBar({
				format: colors.yellow('Extracting') + '  |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total} Files',
				barCompleteChar: '\u2588',
				barIncompleteChar: '\u2591',
				hideCursor: true,
			});
			var spawn = require('child_process').spawn,
				child;
			child = spawn(config.lessmsi, ['x', 'AcumaticaERPInstall.msi', config.location + '\\' + selectedBuild.build]);
			child.stdout.on('data', function (data) {
				try {
					if (progressBar.getProgress() <= 0) {
						var fileCount = data.toString().split('/')[1].match(/\d+/)[0];
						progressBar.start(parseInt(fileCount), 1);
					} else {
						var activeFile = data.toString().split('/')[0].match(/\d+/)[0];
						progressBar.update(parseInt(activeFile));
					}
				} catch (e) {
					//console.log(e);
				}
			});
			child.stderr.on('data', function (data) {
				console.log('Powershell Error: ' + data);
			});
			child.on('exit', async () => {
				progressBar.stop();
				console.log('Extracted!'.green);

				console.log('Moving Files...'.yellow);
				if (fs.existsSync(`AcumaticaERPInstall/SourceDir/Acumatica ERP`)) {
					// Do something

					fs.moveSync(`AcumaticaERPInstall/SourceDir/Acumatica ERP`, `${config.location}/${selectedBuild.build}`, (err) => {
						if (err) return console.error(err);
					});
				} else {
					fs.moveSync(`AcumaticaERPInstall/SourceDir`, `${config.location}/${selectedBuild.build}`, (err) => {
						if (err) return console.error(err);
					});
				}
				console.log('Moved.'.green);

				console.log('Removing temp files...'.yellow);
				fs.rmSync(`AcumaticaERPInstall`, { recursive: true, force: true });
				fs.rmSync(`AcumaticaERPInstall.msi`, { recursive: true, force: true });
				console.log('Done.'.green);

				console.log('COMPLETE!'.green);
				await openExplorer(`${config.location}\\${selectedBuild.build}`);
			});
			child.stdin.end(); //end input
		} else {
			fs.renameSync('AcumaticaERPInstall.msi', `AcumaticaERPInstall-${selectedBuild.build}.msi`);

			console.log(`COMPLETE! - AcumaticaERPInstall-${selectedBuild.build}.msi`.green);

			await openExplorer(__dirname);
		}
	});
}

async function downloadMSI(url, callback) {
	const progressBar = new cliProgress.SingleBar({
		format: colors.yellow('Downloading') + ' |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total} Chunks',
		barCompleteChar: '\u2588',
		barIncompleteChar: '\u2591',
		hideCursor: true,
	});

	const file = fs.createWriteStream('AcumaticaERPInstall.msi');
	let receivedBytes = 0;

	request
		.get(url)
		.on('response', (response) => {
			if (response.statusCode !== 200) {
				return callback('Response status was ' + response.statusCode);
			}

			const totalBytes = response.headers['content-length'];
			progressBar.start(totalBytes, 0);
		})
		.on('data', (chunk) => {
			receivedBytes += chunk.length;
			progressBar.update(receivedBytes);
		})
		.pipe(file)
		.on('error', (err) => {
			fs.unlink(filename);
			progressBar.stop();
			return callback(err.message);
		});

	file.on('finish', () => {
		progressBar.stop();
		file.close(callback);
	});

	file.on('error', (err) => {
		fs.unlink(filename);
		progressBar.stop();
		return callback(err.message);
	});
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
