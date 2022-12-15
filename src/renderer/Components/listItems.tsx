import { Link, useLocation } from 'react-router-dom';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import DashboardIcon from '@mui/icons-material/Dashboard';

import SettingsIcon from '@mui/icons-material/Settings';
import BuildIcon from '@mui/icons-material/Build';

export function MainListItems() {
  const location = useLocation();

  return (
    <>
      <ListItemButton
        component={Link}
        to="/"
        selected={location.pathname == '/'}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Instances" />
      </ListItemButton>
      <ListItemButton
        component={Link}
        to="/builds"
        selected={location.pathname.toLocaleLowerCase().startsWith('/builds')}
      >
        <ListItemIcon>
          <BuildIcon />
        </ListItemIcon>
        <ListItemText primary="Builds" />
      </ListItemButton>
    </>
  );
}

export function SecondaryListItems() {
  const location = useLocation();

  return (
    <>
      <ListItemButton
        component={Link}
        to="/settings"
        selected={location.pathname == '/settings'}
      >
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItemButton>
    </>
  );
}

export function getTitle(path: string): string {
  switch (true) {
    case path == '/':
      return 'Instances';
    case path.toLocaleLowerCase().startsWith('/builds'):
      return 'Builds';
    case path == '/settings':
      return 'Settings';
    default:
      return 'Acumatica Dev Tools';
  }
}
