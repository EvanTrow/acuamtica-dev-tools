import * as React from 'react';
import path from 'path-browserify';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { blue, purple } from '@mui/material/colors';

import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import NewReleasesIcon from '@mui/icons-material/NewReleases';

import { AcumaticaIcon, WindowsExplorerIcon } from '../SvgIcons';
import BuildDownloadingDialog from './Dialogs/BuildDownloadingDialog';
import { BuildRow } from '../types';

export type BuildMenuProps = {
	button: BuildMenuButton;
	build: string;
};
export type BuildMenuButton = 'icon' | 'button';

export default function BuildMenu(props: BuildMenuProps) {
	const [buildExists, setBuildExists] = React.useState(props.button != 'button');

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const [downloadDialogOpen, setDownloadDialogOpen] = React.useState(false);

	const [build, setBuild] = React.useState<BuildRow | undefined>();

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

		window.electronAPI
			.getAvailableBuild(props.build, false)
			.then((b) => {
				setBuild(b);
			})
			.catch(() => {
				return 'test';
			});
	}, []);

	async function CheckIfInstalled() {
		var validPath = await checkPath(window.appSettings.buildLocation + '\\' + props.build);

		if (validPath) {
			setBuildExists(true);
		}
	}

	async function startDownload(build: string) {
		console.log(build);

		window.electronAPI
			.getAvailableBuild(build)
			.then((selectedBuild) => {
				if (selectedBuild.build) {
					setDownloadDialogOpen(true);
					window.electronAPI.downloadBuild(selectedBuild, true);
				}
			})
			.catch((e) => {
				console.error(e);
			});
	}

	const checkPath = async (path: string): Promise<boolean> => {
		const result = await window.electronAPI.checkPath(path);
		return result;
	};

	return (
		<div>
			{props.button == 'icon' ? (
				<IconButton onClick={handleClick}>
					<MoreVertIcon />
				</IconButton>
			) : (
				''
			)}

			{props.button == 'button' ? (
				<Button onClick={handleClick} color='inherit'>
					{props.build}
				</Button>
			) : (
				''
			)}

			<Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
				{buildExists && (
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
				)}
				{buildExists && (
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
				)}

				{build && (
					<MenuItem
						onClick={() => {
							handleClose();
							window.electronAPI.openPDF(`https://acumatica-builds.s3.amazonaws.com/builds/${build.version}/ReleaseNotes/Release_Notes_for_Acumatica_${build.build.replaceAll('.', '_')}.pdf`);
						}}
					>
						<ListItemIcon>
							<NewReleasesIcon fontSize='small' sx={{ color: purple['400'] }} />
						</ListItemIcon>
						<ListItemText>Release Notes</ListItemText>
					</MenuItem>
				)}
				{buildExists && (
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
				)}

				{!buildExists && (
					<MenuItem
						onClick={() => {
							handleClose();

							startDownload(props.build);
						}}
					>
						<ListItemIcon>
							<DownloadIcon fontSize='small' sx={{ color: blue[400] }} />
						</ListItemIcon>
						<ListItemText>Download & Extract Build</ListItemText>
					</MenuItem>
				)}
			</Menu>

			<BuildDownloadingDialog open={downloadDialogOpen} setOpen={setDownloadDialogOpen} build={props.build} />
		</div>
	);
}
