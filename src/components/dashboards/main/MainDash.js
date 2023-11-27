import React, { useState } from 'react';
import { styled } from '@mui/system';
import NavTabs from './NavTabs';
import ChatDashboard from '../chat/ChatDashboard';
import Home from '../home/Home';
import Profile from '../profile/Profile';
import { ChatProvider } from '../../../contexts/ChatContext';
import { NewsProvider } from '../../../contexts/NewsContext';

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

const MainDash = () => {
    const [value, setValue] = useState(0);
    return (
        <>
            <NavTabs setValue={setValue} />
            <DashboardWrapper>
                <Content>
                    {value === 0 && (
                        <NewsProvider>
                            <Home />
                        </NewsProvider>
                    )}
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

export default MainDash;
