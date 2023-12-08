import React, { useState } from 'react';
import { styled } from '@mui/system';
import NavTabs from './NavTabs';
import ChatDashboard from '../chat/ChatDashboard';
import Home from '../home/Home';
import Profile from '../profile/Profile';
import { ChatProvider } from '../../../contexts/ChatContext';
import { NewsProvider } from '../../../contexts/NewsContext';
import { ProfileProvider } from '../../../contexts/ProfileContext';
import { useLocation } from "react-router-dom";

const DashboardWrapper = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    height: `93vh`,
    width: "100%",
    overflow: "auto",
}));

const Content = styled("div")(({ theme }) => ({
    marginTop: theme.spacing(8),
}));

const MainDash = ({ children }) => {
    return (
        <>
            <NavTabs />
            <DashboardWrapper>
                <Content>{children}</Content>
            </DashboardWrapper>
        </>
    );
};

export default MainDash;
