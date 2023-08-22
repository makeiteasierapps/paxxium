import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Toolbar,
    Button,
    Divider,
    Drawer,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Typography,
    InputBase,
    styled,
    alpha,
    IconButton,
    AppBar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChatIcon from '@mui/icons-material/Chat';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SearchIcon from '@mui/icons-material/Search';
import { useDrawer } from '../../contexts/DrawerContext';
import { AuthContext } from '../../contexts/AuthContext';
import { ChatContext } from '../../contexts/ChatContext';
import { getAuth, signOut } from 'firebase/auth';

const drawerWidth = 240;

const StyledAppBar = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    ...theme.mixins.toolbar,
    '& > *': {
        color: '#fff',
    },
}));


const Search = styled('div')(({ theme }) => ({
    display: 'flex',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 'auto',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

export default function TitleBar() {
    const navigate = useNavigate();
    const {username} = useContext(ChatContext);
    const { setIdToken, setUser } = useContext(AuthContext);
    const { open, setOpen } = useDrawer();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleLogout = async () => {
        const auth = getAuth();
        signOut(auth)
            .then(function () {
                setIdToken(null);
                setUser(null);
                navigate('/');
            })
            .catch(function (error) {
                // An error happened.
                console.log(error);
            });
    };

    const list = () => (
        <Box>
            <List>
            </List>

            <Divider />
            <List>
                <ListItem key="logout" disablePadding>
                    <ListItemButton onClick={handleLogout}>
                        <ListItemIcon>
                            <LogoutIcon sx={{ color: '#fff' }} />
                        </ListItemIcon>
                        <ListItemText primary="LogOut" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );



    return (
        <Box sx={{ display: 'flex' }}>
            <StyledAppBar position="fixed" open={open}>
                <Toolbar variant="dense">
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h5"
                        noWrap
                        fontFamily={'Montserrat'}
                        component="div"
                        flexGrow={1}
                    >
                        Welcome {username}
                    </Typography>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                </Toolbar>
            </StyledAppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
                    },
                }}
                variant="temporary"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton
                        onClick={(event) => {
                            event.stopPropagation(); // Stop the event from propagating to the parent button.
                            handleDrawerClose();
                        }}
                    >
                        <ChevronLeftIcon sx={{ color: '#fff' }} />
                    </IconButton>
                </DrawerHeader>

                {list()}
                <Divider />
            </Drawer>
        </Box>
    );
}
