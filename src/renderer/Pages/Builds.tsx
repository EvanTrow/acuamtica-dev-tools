import * as React from 'react';
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
import { BuildsSettingsAlert, BuildsSettingsComplete } from '../Components/Alerts';
import { InstanceRow } from 'renderer/types';

export default function Instances() {
	const [rows, setRows] = React.useState<string[]>([]);

	React.useEffect(() => {
		if (BuildsSettingsComplete()) {
			window.electronAPI.getBuilds().then((builds) => {
				setRows(builds);
			});
		}
	}, []);

	return (
		<>
			{BuildsSettingsComplete() ? (
				<TableContainer component={Paper}>
					<Table aria-label='simple table'>
						<TableHead>
							<TableRow>
								<TableCell>Version</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map((row) => (
								<TableRow key={row} hover>
									<TableCell>{row}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					{rows.length == 0 ? (
						<Box sx={{ width: '100%' }}>
							<LinearProgress />
						</Box>
					) : (
						<></>
					)}
				</TableContainer>
			) : (
				<BuildsSettingsAlert />
			)}
		</>
	);
}
