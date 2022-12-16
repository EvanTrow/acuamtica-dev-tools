import * as React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import MaximizeIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import MinimizeIcon from '@mui/icons-material/HorizontalRule';

import { MainListItems, SecondaryListItems, getTitle } from './Components/listItems';

import Instances from './Pages/Instances';
import Settings from './Pages/Settings';
import Builds from './Pages/Builds';

function Copyright(props: any) {
	return (
		<Typography variant='body2' color='text.secondary' align='center' {...props}>
			{'Check out my Github: '}
			<Link color='inherit' href='https://github.com/EvanTrow' target='_blank'>
				EvanTrow
			</Link>
		</Typography>
	);
}

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
	'& .MuiDrawer-paper': {
		position: 'relative',
		whiteSpace: 'nowrap',
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
		boxSizing: 'border-box',
		...(!open && {
			overflowX: 'hidden',
			transition: theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			width: theme.spacing(7),
			[theme.breakpoints.up('sm')]: {
				width: theme.spacing(9),
			},
		}),
	},
}));

export default function App() {
	const [open, setOpen] = React.useState(true);
	const toggleDrawer = () => {
		setOpen(!open);
	};

	const location = useLocation();

	return (
		<>
			<AppBar className='electionTitlebar' position='static' color='primary' enableColorOnDark style={{ height: 32 }}>
				<Toolbar style={{ paddingLeft: 0, paddingRight: 0, minHeight: 32 }}>
					<IconButton
						className='electionNoDrag'
						size='large'
						sx={{
							borderRadius: 0,
							height: 32,
							width: 32,
						}}
						onClick={toggleDrawer}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant='subtitle1' component='div' sx={{ flexGrow: 1 }}>
						Acumatica Dev Tools
					</Typography>
					<IconButton
						className='electionNoDrag'
						size='large'
						sx={{
							borderRadius: 0,
							height: 32,
							width: 32,
						}}
						onClick={() => window.electronAPI.windowEvents('minimize')}
					>
						<MinimizeIcon />
					</IconButton>
					<IconButton
						className='electionNoDrag'
						size='large'
						sx={{
							borderRadius: 0,
							height: 32,
							width: 32,
						}}
						onClick={() => window.electronAPI.windowEvents('maximize')}
					>
						<MaximizeIcon />
					</IconButton>
					<IconButton
						className='electionNoDrag'
						size='large'
						sx={{
							borderRadius: 0,
							height: 32,
							width: 32,
						}}
						onClick={() => window.electronAPI.windowEvents('close')}
					>
						<CloseIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
			<Box sx={{ display: 'flex' }}>
				<Drawer variant='permanent' open={open}>
					<List component='nav'>
						<MainListItems />
						<Divider sx={{ my: 1 }} />
						<SecondaryListItems />
					</List>
				</Drawer>
				<Box
					component='main'
					sx={{
						backgroundColor: (theme) => (theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900]),
						flexGrow: 1,
						height: 'calc(100vh - 32px)',
						overflow: 'auto',
					}}
				>
					<Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
						<Routes>
							<Route path='/' element={<Instances key={0} />} />
							<Route path='/settings' element={<Settings key={0} />} />
							<Route path='/builds' element={<Builds key={0} />} />
						</Routes>

						<Copyright sx={{ pt: 4 }} />
					</Container>
				</Box>
			</Box>
		</>
	);
}
