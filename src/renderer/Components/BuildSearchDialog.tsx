import * as React from 'react';
import { BuildsRow } from 'renderer/types';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { styled, lighten, darken } from '@mui/system';
import Button from '@mui/material/Button';

export type BuildSearchDialogProps = {
	enabled: boolean;
	open: boolean;
	setOpen(open: boolean): void;
};
const usePrevious = <T extends unknown>(value: T): T | undefined => {
	const ref = React.useRef<T>();
	React.useEffect(() => {
		ref.current = value;
	});
	return ref.current;
};

export default function BuildSearchDialog(props: BuildSearchDialogProps) {
	const openRef = usePrevious(props.open);

	const [builds, setBuilds] = React.useState<BuildsRow[]>([]);
	const [selectedBuild, setSelectedBuild] = React.useState<BuildsRow | undefined>();

	React.useEffect(() => {
		if (openRef == false && builds.length == 0) {
			window.electronAPI.getAvailableBuilds().then((builds) => {
				setBuilds(builds);
				console.log(builds);
			});
		}
	}, [props.open]);

	const handleClose = () => {
		props.setOpen(false);
		if (selectedBuild) {
			console.log(selectedBuild);
			window.electronAPI.sendToast(`Selected Build: ${selectedBuild?.build}`, 'info');
		}
		setSelectedBuild(undefined);
	};

	return (
		<div>
			{props.open.valueOf()}
			<Dialog maxWidth='sm' fullWidth open={props.open} onClose={handleClose}>
				<DialogTitle>Download Build</DialogTitle>
				<DialogContent>
					<Autocomplete
						options={builds}
						groupBy={(option) => option.version}
						getOptionLabel={(option) => option.build}
						renderInput={(params) => <TextField {...params} label='Build Number' />}
						sx={{ marginTop: 1 }}
						value={selectedBuild}
						onChange={(event: any, newValue: BuildsRow | null) => {
							setSelectedBuild(newValue as BuildsRow);
						}}
					/>
				</DialogContent>
				<DialogActions>
					<Button color='inherit' onClick={handleClose}>
						Cancel
					</Button>
					<Button variant='contained' disabled={!selectedBuild} onClick={handleClose}>
						Download
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
