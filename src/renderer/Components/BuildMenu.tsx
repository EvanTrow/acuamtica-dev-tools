import * as React from 'react';
import { BuildMenuProp } from 'renderer/types';
import path from 'path-browserify';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { AcumaticaIcon, WindowsExplorerIcon } from 'renderer/SvgIcons';
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import { blue } from '@mui/material/colors';

export default function BuildMenu(props: BuildMenuProp) {
	const [buildExists, setBuildExists] = React.useState(props.button != 'button');

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	React.useEffect(() => {
		if (props.button == 'button') {
			CheckIfInstalled();
		}
	}, []);

	async function CheckIfInstalled() {
		var validPath = await checkPath(window.appSettings.buildLocation + '\\' + props.build);

		if (validPath) {
			setBuildExists(true);
		}
	}

	const checkPath = async (path: string): Promise<boolean> => {
		const result = await window.electronAPI.checkPath(path);
		return result;
	};

	return (
		<div>
			{props.button == 'icon' ? (
				<IconButton id='long-button' aria-controls={open ? 'long-menu' : undefined} aria-expanded={open ? 'true' : undefined} aria-haspopup='true' onClick={handleClick}>
					<MoreVertIcon />
				</IconButton>
			) : (
				''
			)}

			{props.button == 'button' ? (
				<Button id='long-button' aria-controls={open ? 'long-menu' : undefined} aria-expanded={open ? 'true' : undefined} aria-haspopup='true' onClick={handleClick} color='inherit'>
					{props.build}
				</Button>
			) : (
				''
			)}

			<Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
				{buildExists ? (
					<div>
						<MenuItem
							onClick={() => {
								handleClose();
								window.electronAPI.launchApp(path.join(window.appSettings.buildLocation, props.build, 'Data/AcumaticaConfig.exe'));
							}}
						>
							<ListItemIcon>
								<AcumaticaIcon fontSize='small' color='primary' />
							</ListItemIcon>
							<ListItemText>Configuation Wizard</ListItemText>
						</MenuItem>
						<MenuItem
							onClick={() => {
								handleClose();
								window.electronAPI.launchApp(path.join(window.appSettings.buildLocation, props.build, 'Report Designer/ReportDesigner.exe'));
							}}
						>
							<ListItemIcon>
								<DescriptionIcon fontSize='small' sx={{ color: blue[400] }} />
							</ListItemIcon>
							<ListItemText>Report Designer</ListItemText>
						</MenuItem>
						<MenuItem
							onClick={() => {
								handleClose();
								window.electronAPI.openDirectory(window.appSettings.buildLocation + '\\' + props.build);
							}}
						>
							<ListItemIcon>
								<WindowsExplorerIcon fontSize='small' />
							</ListItemIcon>
							<ListItemText>Open Directory</ListItemText>
						</MenuItem>
					</div>
				) : (
					<MenuItem>
						<ListItemIcon>
							<DownloadIcon fontSize='small' sx={{ color: blue[400] }} />
						</ListItemIcon>
						<ListItemText>Download Build</ListItemText>
					</MenuItem>
				)}
			</Menu>
		</div>
	);
}
