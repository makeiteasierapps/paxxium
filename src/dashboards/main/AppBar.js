import LogoutIcon from "@mui/icons-material/Logout";
import {
    AppBar,
    Box,
    IconButton,
    Toolbar,
    Typography,
    styled,
} from "@mui/material";
import { signOut } from "firebase/auth";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, auth } from "../../contexts/AuthContext";

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
    position: "fixed",
}));

const TitleBar = () => {
    const navigate = useNavigate();
    const { setIdToken, setUser, username, setIsAuthorized } =
        useContext(AuthContext);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIdToken(null);
            setUser(null);
            setIsAuthorized(false);
            localStorage.setItem("isAuthorized", "false");
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Box sx={{ display: "flex" }}>
            <StyledAppBar>
                <Toolbar variant="dense">
                    <Typography
                        variant="h5"
                        noWrap
                        fontFamily={"Montserrat"}
                        component="div"
                        flexGrow={1}
                        align="center"
                    >
                        Welcome {username}
                    </Typography>
                    <IconButton onClick={handleLogout}>
                        <LogoutIcon sx={{ color: "#fff" }} />
                    </IconButton>
                </Toolbar>
            </StyledAppBar>
        </Box>
    );
};

export default TitleBar;
