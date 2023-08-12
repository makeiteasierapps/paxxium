import React, { useContext } from 'react';
import { ChatContext } from '../../contexts/ChatContext';
import { AuthContext } from '../../contexts/AuthContext';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';

import ChatIcon from '@mui/icons-material/Chat';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MuiAppBar from '@mui/material/AppBar';
import NewChatDialog from './NewChatDialog';
import Marquee from '../../utils/Marquee';
import { useNavigate } from 'react-router-dom';
import { useDrawer } from '../../contexts/DrawerContext';
import { getAuth, signOut } from 'firebase/auth';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const drawerWidth = 240;

const NavBar = styled(MuiAppBar, {
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

const StyledButton = styled(Button)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    '.MuiButton-endIcon': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    '.MuiIconButton-root': {
        zIndex: theme.zIndex.tooltip,
    },
}));

export default function Navigation() {
    const {
        setConversationList,
        conversationList,
        switchConversation,
        conversationId,
        setConversationId,
        setMessages,
    } = useContext(ChatContext);

    const [openChat, setOpenChat] = React.useState(false);
    const navigate = useNavigate();

    const { idToken, setIdToken, setUser } = useContext(AuthContext);
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
                {conversationList.map((conversation, index) => (
                    <ListItem key={`conversation-${index}`} disablePadding>
                        <StyledButton
                            startIcon={<ChatIcon />}
                            endIcon={
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(conversation.id);
                                    }}
                                    edge="end"
                                    style={{
                                        visibility:
                                            conversationId === conversation.id
                                                ? 'visible'
                                                : 'hidden',
                                    }}
                                >
                                    <DeleteIcon
                                        fontSize="small"
                                        sx={{
                                            color:
                                                conversationId ===
                                                conversation.id
                                                    ? '#fff'
                                                    : 'transparent',
                                            zIndex: 5000,
                                            fontSize: '1.25rem',
                                        }}
                                    />
                                </IconButton>
                            }
                            onClick={() => {
                                switchConversation(conversation.id);
                            }}
                        >
                            <Marquee
                                text={conversation.agent_name}
                                isSelected={conversationId === conversation.id}
                                drawerOpen={open}
                            />
                        </StyledButton>
                    </ListItem>
                ))}
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

    const handleDelete = async (id) => {
        try {
            const response = await fetch(
                `${backendUrl}/delete_conversation/${id}`,
                {
                    method: 'DELETE',
                    headers: { Authorization: idToken },
                    credentials: 'include',
                }
            );

            if (!response.ok) throw new Error('Failed to delete conversation');

            // If the delete was successful, update the state:
            const updatedConversationList = conversationList.filter(
                (conversation) => conversation.id !== id
            );
            setConversationList(updatedConversationList);

            // If the current conversation is the one being deleted, select another one, or set it to null if there are no other conversations
            if (conversationId === id) {
                if (updatedConversationList.length > 0) {
                    setConversationId(updatedConversationList[0].id);
                } else {
                    setConversationId(null);
                    setMessages([]);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <NavBar position="fixed" open={open}>
                <Toolbar>
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
                    >
                        Paxxium
                    </Typography>
                </Toolbar>
            </NavBar>
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
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <Button
                        fullWidth
                        onClick={() => setOpenChat(true)}
                        startIcon={<ChatIcon />}
                        endIcon={<span style={{ flexGrow: 1 }} />} // This empty span is used to push the IconButton to the end
                        sx={{ justifyContent: 'flex-start' }}
                    >
                        New Chat
                    </Button>
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
                <NewChatDialog
                    open={openChat}
                    handleClose={() => setOpenChat(false)}
                />
            </Drawer>
        </Box>
    );
}
