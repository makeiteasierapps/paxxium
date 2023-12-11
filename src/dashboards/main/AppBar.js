import LogoutIcon from "@mui/icons-material/Logout";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { signOut } from "firebase/auth";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, auth } from "../../auth/AuthContext";

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
        <AppBar id="header" position="sticky" sx={{ top: 0 }}>
            <Toolbar variant="dense">
                <Typography
                    id="welcome-message"
                    variant="h5"
                    noWrap
                    fontFamily={"Montserrat"}
                    component="div"
                    flexGrow={1}
                    align="center"
                >
                    Welcome {username}
                </Typography>
                <IconButton id="logout-button" onClick={handleLogout}>
                    <LogoutIcon sx={{ color: "#fff" }} />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default TitleBar;
