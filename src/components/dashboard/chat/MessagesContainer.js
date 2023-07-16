import React from 'react';
import { styled } from '@mui/system';

const MessagesContainerStyled = styled('div')({
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    whiteSpace: 'pre-line',
});

const MessagesContainer = ({ children }) => {
    return <MessagesContainerStyled>{children}</MessagesContainerStyled>;
};

export default MessagesContainer;
