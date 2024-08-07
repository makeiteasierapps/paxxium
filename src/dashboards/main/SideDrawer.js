import React, { useState } from 'react';
import {
    Box,
    Drawer,
    Typography,
    MenuItem,
    Tooltip,
    Popover,
    Collapse,
} from '@mui/material';
import {
    Home as HomeIcon,
    People as AgentsIcon,
    Settings as SettingsIcon,
    AccountCircle as ProfileIcon,
    AccountTree as AccountTreeIcon,
    Logout as LogoutIcon,
    ExpandLess,
    ExpandMore,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import paxxiumLogo from '../../assets/images/paxxium-logo.png';
import paxxiumTextLogo from '../../assets/images/paxxium-logo-text-only.png';
import { signOut } from 'firebase/auth';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, auth } from '../../contexts/AuthContext';
import { HeaderIconButton } from './mainStyledComponents';

const SideDrawer = ({
    mobileOpen,
    setMobileOpen,
    drawerWidth,
    handleDrawerExpand,
    isDrawerExpanded,
    expandedDrawerWidth,
}) => {
    const location = useLocation();
    const [popOverAnchor, setPopOverAnchor] = useState(null);
    const [agentsOpen, setAgentsOpen] = useState(false);
    const navigate = useNavigate();
    const { setIdToken, setUser, setIsAuthorized } = useContext(AuthContext);
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIdToken(null);
            setUser(null);
            setIsAuthorized(false);
            localStorage.clear();
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    const ConditionalTooltip = ({ children, title, condition }) => {
        return condition ? (
            <Tooltip title={title} placement="right">
                {children}
            </Tooltip>
        ) : (
            children
        );
    };

    const homeButton = (
        <ConditionalTooltip title="Home" condition={!isDrawerExpanded}>
            <HeaderIconButton
                disableRipple
                component={Link}
                to="/home"
                currentPath={location.pathname}
            >
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <HomeIcon sx={{ fontSize: '2rem' }} />
                    {isDrawerExpanded && (
                        <Typography paddingLeft={1}>Home</Typography>
                    )}
                </Box>
            </HeaderIconButton>
        </ConditionalTooltip>
    );

    const profileButton = (
        <ConditionalTooltip title="Profile" condition={!isDrawerExpanded}>
            <HeaderIconButton
                disableRipple
                component={Link}
                to="/profile"
                currentPath={location.pathname}
            >
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <ProfileIcon sx={{ fontSize: '2rem' }} />
                    {isDrawerExpanded && (
                        <Typography paddingLeft={1}>Profile</Typography>
                    )}
                </Box>
            </HeaderIconButton>
        </ConditionalTooltip>
    );

    const KbButton = (
        <ConditionalTooltip title="Knowledge Base" condition={!isDrawerExpanded}>
            <HeaderIconButton
                disableRipple
                component={Link}
                to="/kb"
                currentPath={location.pathname}
            >
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <AccountTreeIcon sx={{ fontSize: '2rem' }} />
                    {isDrawerExpanded && (
                        <Typography paddingLeft={1}>Knowledge Base</Typography>
                    )}
                </Box>
            </HeaderIconButton>
        </ConditionalTooltip>
    );
    const settingsButton = (
        <ConditionalTooltip title="Settings" condition={!isDrawerExpanded}>
            <HeaderIconButton
                disableRipple
                component={Link}
                to="/settings"
                currentPath={location.pathname}
            >
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <SettingsIcon sx={{ fontSize: '2rem' }} />
                    {isDrawerExpanded && (
                        <Typography paddingLeft={1}>Settings</Typography>
                    )}
                </Box>
            </HeaderIconButton>
        </ConditionalTooltip>
    );

    const logoutButton = (
        <ConditionalTooltip title="Logout" condition={!isDrawerExpanded}>
            <HeaderIconButton
                disableRipple
                id="logout-button"
                onClick={handleLogout}
            >
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <LogoutIcon sx={{ fontSize: '2rem' }} />
                    {isDrawerExpanded && (
                        <Typography paddingLeft={1}>Logout</Typography>
                    )}
                </Box>
            </HeaderIconButton>
        </ConditionalTooltip>
    );

    const AgentMenuItems = () => (
        <>
            <MenuItem
                onClick={() => setPopOverAnchor(null)}
                component={Link}
                to="/agents"
            >
                Chat
            </MenuItem>
            <MenuItem
                onClick={() => setPopOverAnchor(null)}
                component={Link}
                to="/dalle"
            >
                Image
            </MenuItem>
        </>
    );

    const drawer = (
        <Box
            sx={{
                display: 'flex',
                p: '5px',

                width: {
                    sm: isDrawerExpanded ? expandedDrawerWidth : drawerWidth,
                },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isDrawerExpanded ? 'flex-start' : 'center',
                    width: '100%',
                }}
            >
                {/* Logo */}
                {!isDrawerExpanded ? (
                    <Box
                        component={'img'}
                        src={paxxiumLogo}
                        width="50px"
                        sx={{
                            display: 'flex',
                            padding: '8px',
                        }}
                        alt="logo"
                    />
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            paddingBottom: '20px',
                        }}
                    >
                        <Box
                            component={'img'}
                            src={paxxiumLogo}
                            width="50px"
                            sx={{
                                display: 'flex',
                                padding: '5px',
                            }}
                            alt="logo"
                        />
                        <Box
                            component={'img'}
                            src={paxxiumTextLogo}
                            width="80px"
                            sx={{
                                display: 'flex',
                                paddingLeft: '7px',
                            }}
                            alt="logo"
                        />
                    </Box>
                )}

                {/* Menu Items */}

                {homeButton}

                {!isDrawerExpanded ? (
                    <>
                        <Tooltip title="Agents" placement="right">
                            <HeaderIconButton
                                disableRipple
                                onClick={(event) => {
                                    setPopOverAnchor(event.currentTarget);
                                }}
                                currentPath={location.pathname}
                                to="/agents"
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <AgentsIcon sx={{ fontSize: '2rem' }} />
                                    {isDrawerExpanded && (
                                        <Typography
                                            paddingLeft={1}
                                            paddingRight={1}
                                        >
                                            Agents
                                        </Typography>
                                    )}
                                    {isDrawerExpanded &&
                                        (agentsOpen ? (
                                            <ExpandLess />
                                        ) : (
                                            <ExpandMore />
                                        ))}
                                </Box>
                            </HeaderIconButton>
                        </Tooltip>
                        <Popover
                            open={Boolean(popOverAnchor)}
                            anchorEl={popOverAnchor}
                            onClick={() => setPopOverAnchor(null)}
                        >
                            <AgentMenuItems />
                        </Popover>
                    </>
                ) : (
                    <>
                        <HeaderIconButton
                            disableRipple
                            onClick={(event) => {
                                setAgentsOpen(!agentsOpen);
                            }}
                            currentPath={location.pathname}
                            to="/agents"
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <AgentsIcon sx={{ fontSize: '2rem' }} />
                                {isDrawerExpanded && (
                                    <Typography
                                        paddingLeft={1}
                                        paddingRight={1}
                                    >
                                        Agents
                                    </Typography>
                                )}
                                {isDrawerExpanded &&
                                    (agentsOpen ? (
                                        <ExpandLess />
                                    ) : (
                                        <ExpandMore />
                                    ))}
                            </Box>
                        </HeaderIconButton>
                        <Collapse in={agentsOpen}>
                            <AgentMenuItems />
                        </Collapse>
                    </>
                )}

                {profileButton}
                {KbButton}
                {settingsButton}
                {logoutButton}
            </Box>
        </Box>
    );

    return (
        <>
            <Drawer
                anchor="left"
                variant="temporary"
                open={mobileOpen}
                onClose={setMobileOpen}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                }}
            >
                {drawer}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isDrawerExpanded ? 'flex-end' : 'center',
                        width: '100%',
                        padding: isDrawerExpanded ? '10px' : '0px',
                    }}
                >
                    <HeaderIconButton
                        disableRipple
                        onClick={() => {
                            setMobileOpen(false);
                        }}
                    >
                        <KeyboardArrowLeft />
                    </HeaderIconButton>
                </Box>
            </Drawer>
            <Drawer
                anchor="left"
                id="mobileDrawer"
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                }}
                open
            >
                {drawer}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isDrawerExpanded ? 'flex-end' : 'center',
                        width: '100%',
                        padding: isDrawerExpanded ? '10px' : '0px',
                    }}
                >
                    <HeaderIconButton
                        disableRipple
                        onClick={handleDrawerExpand}
                    >
                        {isDrawerExpanded ? (
                            <KeyboardArrowLeft />
                        ) : (
                            <KeyboardArrowRight />
                        )}
                    </HeaderIconButton>
                </Box>
            </Drawer>
        </>
    );
};

export default SideDrawer;
