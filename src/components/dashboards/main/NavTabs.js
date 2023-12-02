import { useState } from "react";
import { Tabs, Tab, Box, styled } from "@mui/material";
import { Link } from "react-router-dom";

// Function to generate accessibility properties for tabs
// This function provides flexibility, reduces errors, promotes code reusability, and improves readability
function a11yProps(index) {
    // Return an object with id and aria-controls properties
    // These properties are used by screen readers and other assistive technologies
    return {
        id: `simple-tab-${index}`, // unique id for each tab
        "aria-controls": `simple-tabpanel-${index}`, // id of the element controlled by this tab
    };
}

// Styled Components
const StyledNavTabs = styled(Tabs)(({ theme }) => ({
    position: "fixed",
    top: "48px", // replace '64px' with the height of your AppBar
    zIndex: theme.zIndex.appBar,
    width: "100%",
    backgroundColor: theme.palette.background.default,
}));

// Define NavTabs component
const NavTabs = () => {
    // Use React's useState hook to manage the selected tab index
    const [index, setIndex] = useState(0);

    // Render the NavTabs component
    return (
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <StyledNavTabs
                value={index}
                onChange={(_, index) => {
                    setIndex(index);
                    // setValue(index);
                }}
                sx={{
                    // Remove the tab indicator
                    "& .MuiTabs-indicator": {
                        display: "none",
                    },
                }}
                aria-label="navigation tabs"
                variant="fullWidth"
                textColor="secondary"
            >
                {/* Use the a11yProps function to generate unique id and aria-controls values for each tab */}
                <Tab
                    label="Home"
                    {...a11yProps(0)}
                    component={Link}
                    to="/home"
                />
                <Tab
                    label="Agents"
                    {...a11yProps(1)}
                    component={Link}
                    to="/agents"
                />
                <Tab
                    label="Profile"
                    {...a11yProps(2)}
                    component={Link}
                    to="/profile"
                />
            </StyledNavTabs>
        </Box>
    );
};

// Export the NavTabs component as the default export
export default NavTabs;
