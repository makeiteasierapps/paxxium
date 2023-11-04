import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Toolbar,
    Box,
    Typography,
    styled,
    IconButton,
    AppBar
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthContext } from '../../../contexts/AuthContext';
import { getAuth, signOut } from 'firebase/auth';


// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
    position: 'fixed',
}));


const TitleBar = () => {
    const navigate = useNavigate();
    const {username} = useContext(AuthContext);
    const { setIdToken, setUser } = useContext(AuthContext);

    const handleLogout = async () => {
        const auth = getAuth();
        signOut(auth)
            .then(function () {
                setIdToken(null);
                setUser(null);
                navigate('/');
            })
            .catch(function (error) {
                // An error happened.
                console.log(error);
            });
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <StyledAppBar>
                <Toolbar variant="dense">
                    <Typography
                        variant="h5"
                        noWrap
                        fontFamily={'Montserrat'}
                        component="div"
                        flexGrow={1}
                        align="center"
                    >
                        Welcome {username}
                    </Typography>
                    <IconButton onClick={handleLogout}>
                        <LogoutIcon sx={{ color: '#fff' }} />
                    </IconButton>
                </Toolbar>
            </StyledAppBar>
        </Box>
    );
}

export default TitleBar;