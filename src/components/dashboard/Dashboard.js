import React from 'react';
import { styled } from '@mui/system';
import NavTabs from './NavTabs';
const DashboardWrapper = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: `93vh`,
    width: '100%',
    overflow: 'auto',
}));

const StyledNavTabs = styled(NavTabs)(({ theme }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.appBar, // ensures the navigation is above other content
}));

const Content = styled('div')(({ theme }) => ({
    marginTop: theme.spacing(8), 
}));

const Dashboard = () => {
    return (
        <DashboardWrapper>
            <StyledNavTabs />
            <Content></Content>
        </DashboardWrapper>
    );
};

export default Dashboard;
