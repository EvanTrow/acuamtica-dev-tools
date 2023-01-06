import * as React from 'react';
import { InstanceRow } from 'renderer/types';

import { DonutChart } from '@tremor/react';
const colors = [
	'slate',
	'gray',
	'zinc',
	'neutral',
	'stone',
	'red',
	'orange',
	'amber',
	'yellow',
	'lime',
	'green',
	'emerald',
	'teal',
	'cyan',
	'sky',
	'blue',
	'indigo',
	'violet',
	'purple',
	'fuchsia',
	'pink',
	'rose',
];

import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import SyncIcon from '@mui/icons-material/Sync';

import { InstanceSettingsAlert, InstanceSettingsComplete } from '../Components/Alerts';
import BuildMenu from '../Components/BuildMenu';
import InstanceMenu from '../Components/InstanceMenu';
import { Typography } from '@mui/material';

export default function Instances() {
	const [instances, setInstances] = React.useState<InstanceRow[]>([]);
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		if (InstanceSettingsComplete()) {
			window.electronAPI
				.getInstances()
				.then((instanceData) => {
					setLoading(false);
					setInstances(instanceData);
				})
				.catch((e) => {
					console.error(e);
				});
		}
	}, []);

	return (
		<>
			{InstanceSettingsComplete() ? (
				<>
					<TableContainer component={Paper}>
						<Table aria-label='simple table'>
							<TableHead>
								<TableRow>
									<TableCell>Name</TableCell>
									<TableCell>Version</TableCell>
									<TableCell>Install Path</TableCell>
									<TableCell>Database</TableCell>
									<TableCell></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{instances
									.sort((a, b) => (a.name > b.name ? 1 : -1))
									.map((instance) => (
										<TableRow key={instance.name} hover>
											<TableCell component='th' scope='row'>
												<Link href={`http://${window.appSettings.hostname}/${instance.path}`} target='_blank'>
													{instance.name}
												</Link>
											</TableCell>
											<TableCell sx={{ paddingTop: 0.5, paddingBottom: 0.5 }}>{instance.version && <BuildMenu build={instance.version} button='button' />}</TableCell>
											<TableCell sx={{ paddingTop: 0.5, paddingBottom: 0.5 }}>
												<Button
													onClick={() => {
														window.electronAPI.openDirectory(instance.installPath);
													}}
													color='inherit'
													sx={{ textTransform: 'none' }}
												>
													{instance.installPath}
												</Button>
											</TableCell>
											<TableCell>
												<Tooltip
													title={
														<div>
															DB: {instance?.dbSize?.toFixed(2)} GB
															<br />
															Log: {instance?.dbLogSize?.toFixed(2)} GB
															<br />
															Total: {instance?.dbTotalSize?.toFixed(2)} GB
														</div>
													}
													followCursor
												>
													<Box>{instance.dbName}</Box>
												</Tooltip>
											</TableCell>
											<TableCell sx={{ paddingTop: 0.5, paddingBottom: 0.5 }}>
												<InstanceMenu instance={instance} />
											</TableCell>
										</TableRow>
									))}
							</TableBody>
						</Table>
						{instances.length == 0 || loading == true ? (
							<Box sx={{ width: '100%' }}>
								<LinearProgress />
							</Box>
						) : (
							<></>
						)}
					</TableContainer>
					<br />
					<Box display='flex' justifyContent='flex-end' alignItems='flex-end'>
						<Button
							variant='contained'
							endIcon={<SyncIcon />}
							onClick={() => {
								setLoading(true);
								setInstances([]);

								window.electronAPI.reloadInstances().then((val) => {
									window.electronAPI.getInstances().then((instanceData) => {
										setLoading(false);
										setInstances(instanceData);
									});
								});
							}}
						>
							Reload Instances
						</Button>
					</Box>
					<Box sx={{ marginTop: 4, marginBottom: 2 }}>
						<Typography variant='h5'>Storage Usage</Typography>
						<DonutChart
							data={instances}
							category='dbTotalSize'
							dataKey='name'
							valueFormatter={(number: number) => `${number.toFixed(2)} GB`}
							height={'h-64'}
							// @ts-ignore
							colors={instances.map(() => colors[Math.floor(Math.random() * colors.length)])}
						/>
					</Box>
				</>
			) : (
				<InstanceSettingsAlert />
			)}
		</>
	);
}
