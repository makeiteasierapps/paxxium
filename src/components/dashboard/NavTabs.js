import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import AgentDashboard from '../AgentDashboard';
import NewsCarousel from '../home/NewsCarousel';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const NavTabs = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                >
                    <Tab label="Home" {...a11yProps(0)} />
                    <Tab label="Agents" {...a11yProps(1)} />
                    <Tab label="Profile" {...a11yProps(2)} />
                </Tabs>
            </Box>
            {value === 0 && <NewsCarousel />}
            {value === 1 && <AgentDashboard />}
            {value === 2 && <h1>Profile</h1>}
        </Box>
    );
};

export default NavTabs;
