import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Toolbar,
    Box,
    Typography,
    InputBase,
    styled,
    alpha,
    IconButton,
    AppBar
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import { AuthContext } from '../../contexts/AuthContext';
import { ChatContext } from '../../contexts/ChatContext';
import { getAuth, signOut } from 'firebase/auth';


const StyledAppBar = styled(AppBar)(({ theme }) => ({
    position: 'fixed',
}));



const Search = styled('div')(({ theme }) => ({
    display: 'flex',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 'auto',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

export default function TitleBar() {
    const navigate = useNavigate();
    const {username} = useContext(ChatContext);
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
                    {/* <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search> */}
                    {/* <IconButton onClick={handleLogout}>
                        <LogoutIcon sx={{ color: '#fff' }} />
                    </IconButton> */}
                </Toolbar>
            </StyledAppBar>
        </Box>
    );
}
