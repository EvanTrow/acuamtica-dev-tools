import * as React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';

import { BuildsSettingsAlert, BuildsSettingsComplete } from '../Components/Alerts';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import BuildMenu from 'renderer/Components/BuildMenu';
import BuildSearchDialog from 'renderer/Components/BuildSearchDialog';

export default function Instances() {
	const [filter, setFilter] = React.useState('');

	const [loadingDirectory, setLoadingDirectory] = React.useState('');
	const [loadingReport, setLoadingReport] = React.useState('');
	const [loadingConfig, setLoadingConfig] = React.useState('');

	const [builds, setBuilds] = React.useState<string[]>([]);

	const [dialogOpen, setDialogOpen] = React.useState(false);

	React.useEffect(() => {
		if (BuildsSettingsComplete()) {
			window.electronAPI.getBuilds().then((builds) => {
				setBuilds(builds.reverse());
			});
		}
	}, []);

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
							<Box sx={{ width: '100%', maxWidth: 360 }}>
								<Card>
									<List>
										{builds
											.filter((build) => build.includes(filter))
											.map((build, i) => (
												<React.Fragment key={build}>
													<ListItem secondaryAction={<BuildMenu build={build} button='icon' />} disablePadding>
														<ListItemButton>
															<ListItemText primary={build} />
														</ListItemButton>
													</ListItem>
													{i + 1 == builds.filter((build) => build.includes(filter)).length ? '' : <Divider />}
												</React.Fragment>
											))}
									</List>
								</Card>
							</Box>
						</Grid>
					</Grid>

					<Fab color='primary' aria-label='download' sx={{ position: 'absolute', bottom: 16, right: 16 }} onClick={() => setDialogOpen(true)}>
						<DownloadIcon />
					</Fab>

					<BuildSearchDialog enabled={BuildsSettingsComplete()} open={dialogOpen} setOpen={(open) => setDialogOpen(open)} />
				</>
			) : (
				<BuildsSettingsAlert />
			)}
		</>
	);
}
