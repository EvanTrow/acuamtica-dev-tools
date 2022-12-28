import * as React from 'react';
import { InstanceRow } from 'renderer/types';

import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { amber, cyan } from '@mui/material/colors';

import ConstructionIcon from '@mui/icons-material/Construction';
import LockResetIcon from '@mui/icons-material/LockReset';

export type InstancesMenuProps = {
	instance: InstanceRow;
};

export default function InstanceMenu(props: InstancesMenuProps) {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			<IconButton onClick={handleClick}>
				<MoreVertIcon />
			</IconButton>

			<Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
				<Tooltip
					title={
						<div>
							Sets:
							<br />
							CompilePages = False
							<br />
							optimizeCompilations = True
							<br />
							<br />
							Backup config file will be created: <br />"{props.instance.installPath}Web.config.adt-bak"
						</div>
					}
					enterDelay={1000}
				>
					<MenuItem
						onClick={() => {
							handleClose();
							window.electronAPI.prepareInstanceForDev(props.instance);
						}}
					>
						<ListItemIcon>
							<ConstructionIcon fontSize='small' sx={{ color: amber[600] }} />
						</ListItemIcon>
						<ListItemText>Prepare for Development</ListItemText>
					</MenuItem>
				</Tooltip>
				{window.appSettings.resetPassword?.trim()?.length > 0 && (
					<MenuItem
						onClick={() => {
							handleClose();
							window.electronAPI.resetUserPassword(props.instance);
						}}
					>
						<ListItemIcon>
							<LockResetIcon fontSize='small' sx={{ color: cyan[400] }} />
						</ListItemIcon>
						<ListItemText>{window.appSettings.resetPasswordAll ? 'Reset All User Passwords' : 'Reset Admin Password'}</ListItemText>
					</MenuItem>
				)}
			</Menu>
		</div>
	);
}
