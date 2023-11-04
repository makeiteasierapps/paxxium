import React, { useState } from 'react';
import { styled } from '@mui/system';
import NavTabs from './NavTabs';
import ChatDashboard from '../chat/ChatDashboard';
import NewsCarousel from '../../dashboards/home/NewsCarousel';
import Profile from '../profile/Profile';
import { ChatProvider } from '../../../contexts/ChatContext';

const DashboardWrapper = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: `93vh`,
    width: '100%',
    overflow: 'auto',
}));

const Content = styled('div')(({ theme }) => ({
    marginTop: theme.spacing(8),
}));

const Dashboard = () => {
    const [value, setValue] = useState(0);
    return (
        <>
            <NavTabs setValue={setValue} />
            <DashboardWrapper>
                <Content>
                    {value === 0 && <NewsCarousel />}
                    {value === 1 && (
                        <ChatProvider>
                            <ChatDashboard />
                        </ChatProvider>
                    )}
                    {value === 2 && <Profile />}
                </Content>
            </DashboardWrapper>
        </>
    );
};

export default Dashboard;
