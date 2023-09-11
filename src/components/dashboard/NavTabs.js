import React, { useState } from 'react';
import { Tabs, Tab, Box, styled } from '@mui/material';



function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const StyledNavTabs = styled(Tabs)(({ theme }) => ({
    position: 'fixed',
    top: '48px', // replace '64px' with the height of your AppBar
    zIndex: theme.zIndex.appBar,
    width: '100%',
    backgroundColor: theme.palette.background.default,
    
}));

const NavTabs = ({setValue}) => {
    const [value, setLocalValue] = useState(0);
    const handleChange = (event, newValue) => {
        setLocalValue(newValue);
        setValue(newValue);
    };

    return (

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <StyledNavTabs
                    value={value}
                    onChange={handleChange}
                    sx={{
                        // Remove the tab indicator
                        '& .MuiTabs-indicator': {
                          display: 'none',
                        },
                      }}
                    aria-label="navigation tabs"
                    variant="fullWidth"
                    textColor="secondary"

                >
                    <Tab label="Home" {...a11yProps(0)} />
                    <Tab label="Agents" {...a11yProps(1)} />
                    <Tab label="Profile" {...a11yProps(2)} />
                </StyledNavTabs>


        </Box>
    );
};

export default NavTabs;
