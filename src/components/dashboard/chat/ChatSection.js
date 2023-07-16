import React from 'react';
import { useDrawer } from '../../../contexts/DrawerContext';
import { styled } from '@mui/system';

const ChatSectionStyled = styled('div')(({ theme, open }) => ({
    marginLeft: -240,
    height: `calc(100vh - 64px)`,
    width: '50%',
    marginTop: 45,
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: 0,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
    display: 'flex',
    flexDirection: 'column',
}));

const ChatSection = ({ children }) => {
    const { open } = useDrawer();
    return <ChatSectionStyled open={open}>{children}</ChatSectionStyled>;
};

export default ChatSection;
