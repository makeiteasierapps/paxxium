import React, { useState } from 'react';
import { styled } from '@mui/system';
import NavTabs from './NavTabs';
import AgentDashboard from '../AgentDashboard';
import NewsCarousel from '../home/NewsCarousel';


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
                    {value === 1 && <AgentDashboard />}
                    {value === 2 && <h1>Profile</h1>}
                </Content>
            </DashboardWrapper>
        </>
    );
};

export default Dashboard;
