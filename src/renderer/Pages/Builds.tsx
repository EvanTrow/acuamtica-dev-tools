import * as React from 'react';

import { AcumaticaIcon } from 'renderer/SvgIcons';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';

import { BuildsSettingsAlert, BuildsSettingsComplete } from '../Components/Alerts';

import { Box, Button, Card, Divider, Fab, Grid, IconButton, InputAdornment, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Stack, TextField } from '@mui/material';
import path from 'path-browserify';

import { blue } from '@mui/material/colors';
import BuildMenu from 'renderer/Components/BuildMenu';
import BuildSearchDialog from 'renderer/Components/Dialogs/BuildSearchDialog';
import BuildDownloadingDialog from 'renderer/Components/Dialogs/BuildDownloadingDialog';
import AlertDialog from 'renderer/Components/Dialogs/AlertDialog';

export default function Instances() {
	const [filter, setFilter] = React.useState('');

	const [builds, setBuilds] = React.useState<string[]>([]);

	const [dialogOpen, setDialogOpen] = React.useState(false);
	const [buildExists, setBuildExists] = React.useState(false);
	const [askExtractAlertOpen, setAskExtractAlertOpen] = React.useState(false);
	const [downloadProgressOpen, setDownloadProgressOpen] = React.useState(false);

	async function startDownload(extract: boolean) {
		window.electronAPI
			.getAvailableBuild(filter)
			.then((selectedBuild) => {
				if (selectedBuild.build) {
					setDownloadProgressOpen(true);
					window.electronAPI.downloadBuild(selectedBuild, extract);
				}
			})
			.catch((e) => {
				console.error(e);
			});
	}

	async function getBuild() {
		if (BuildsSettingsComplete()) {
			window.electronAPI
				.getBuilds()
				.then((builds) => {
					setBuilds(builds.reverse());
				})
				.catch((e) => {
					console.error(e);
				});
		}
	}

	React.useEffect(() => {
		window.electronAPI
			.getAvailableBuild(filter, false)
			.then((selectedBuild) => {
				if (selectedBuild.build) {
					setBuildExists(true);
				} else {
					setBuildExists(false);
				}
			})
			.catch((e) => {
				setBuildExists(false);
				console.error(e);
			});
	}, [filter]);

	React.useEffect(() => {
		getBuild();
	}, []);

	React.useEffect(() => {
		if (BuildsSettingsComplete()) {
			window.electronAPI
				.getBuilds()
				.then((builds) => {
					setBuilds(builds.reverse());
				})
				.catch((e) => {
					console.error(e);
				});
		}
	}, [dialogOpen]);

	window.electronAPI.events.on('reloadBuilds', () => {
		setFilter('');
		getBuild();
	});

	return (
		<>
			{BuildsSettingsComplete() ? (
				<>
					<Grid container spacing={2} minHeight={160}>
						<Grid item xs={12} display='flex' justifyContent='center' alignItems='center'>
							<TextField
								size='small'
								label='Filter'
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<SearchIcon />
										</InputAdornment>
									),
								}}
								variant='outlined'
								sx={{ width: 350 }}
								value={filter}
								onChange={(e) => setFilter(e.target.value)}
							/>
						</Grid>
						<Grid item xs={12} display='flex' justifyContent='center' alignItems='center'>
							<Box sx={{ width: '100%', maxWidth: 400 }}>
								{builds.filter((build) => build.includes(filter)).length > 0 && (
									<Card>
										<List>
											{builds
												.filter((build) => build.includes(filter))
												.map((build, i) => (
													<React.Fragment key={build}>
														<ListItem
															secondaryAction={
																<Stack direction='row' spacing={1}>
																	<IconButton
																		onClick={() => {
																			window.electronAPI.launchApp(path.join(window.appSettings.buildLocation, build, 'Data/AcumaticaConfig.exe'));
																		}}
																	>
																		<AcumaticaIcon fontSize='small' color='primary' />
																	</IconButton>
																	<IconButton
																		onClick={() => {
																			window.electronAPI.launchApp(path.join(window.appSettings.buildLocation, build, 'Report Designer/ReportDesigner.exe'));
																		}}
																	>
																		<DescriptionIcon fontSize='small' sx={{ color: blue[400] }} />
																	</IconButton>
																	<BuildMenu build={build} button='icon' />
																</Stack>
															}
															disablePadding
														>
															<ListItemButton>
																<ListItemText primary={build} />
															</ListItemButton>
														</ListItem>
														{i + 1 == builds.filter((build) => build.includes(filter)).length ? '' : <Divider />}
													</React.Fragment>
												))}
										</List>
									</Card>
								)}

								{builds.filter((build) => build.includes(filter)).length === 0 && (
									<Button variant='contained' fullWidth onClick={() => setAskExtractAlertOpen(true)} disabled={!buildExists}>
										{buildExists ? `Download ${filter}` : `Build Doesn't Exists`}
									</Button>
								)}
							</Box>
						</Grid>
					</Grid>

					<Fab color='primary' aria-label='download' sx={{ position: 'absolute', bottom: 16, right: 16 }} onClick={() => setDialogOpen(true)}>
						<DownloadIcon />
					</Fab>

					<BuildSearchDialog enabled={BuildsSettingsComplete()} open={dialogOpen} setOpen={(open) => setDialogOpen(open)} />

					<BuildDownloadingDialog open={downloadProgressOpen} setOpen={setDownloadProgressOpen} build={filter} />
					<AlertDialog
						open={askExtractAlertOpen}
						title='Extract MSI?'
						confirmBtn='Download and Extract'
						confirmBtnColor='primary'
						dismissBtn='download'
						dismiss={() => startDownload(false)}
						confirm={() => startDownload(true)}
						setOpen={setAskExtractAlertOpen}
						data={{ build: filter }}
					/>
				</>
			) : (
				<BuildsSettingsAlert />
			)}
		</>
	);
}
