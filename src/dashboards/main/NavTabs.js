import { Tab, Tabs, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// generates accessibility properties for tabs
// flexibile, reduces errors, promotes code reusability, improves readability
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
    position: "sticky",
    top: "48px", // replace '64px' with the height of your AppBar
    zIndex: theme.zIndex.appBar,
    backgroundColor: theme.palette.background.default,
    // Remove the tab indicator
    "& .MuiTabs-indicator": {
        display: "none",
    },
    borderWidth: 0,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: "divider",
}));

// Define NavTabs component
const NavTabs = () => {
    const location = useLocation();
    // Use React's useState hook to manage the selected tab index
    const [selectedTab, setSelectedTab] = useState(0);

    const getTabValue = (path) => {
        // Map paths to corresponding tab index
        const pathToTabIndex = {
            "/agents": 1,
            "/profile": 2,
        };

        const tabIndex = pathToTabIndex[path] || 0;
        return tabIndex;
    };

    useEffect(() => {
        setSelectedTab(getTabValue(location.pathname));
    }, [location]);

    // Render the NavTabs component
    return (
        <StyledNavTabs
            id="nav-tabs"
            value={selectedTab}
            aria-label="navigation tabs"
            variant="fullWidth"
            textColor="secondary"
        >
            {/* Use the a11yProps function to generate unique id and aria-controls values for each tab */}
            <Tab label="Home" {...a11yProps(0)} component={Link} to="/home" />
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
    );
};

// Export the NavTabs component as the default export
export default NavTabs;
