import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { ProfileContext } from '../../../contexts/ProfileContext';
import { TextField, Avatar, Box, Typography } from '@mui/material';
import { styled } from '@mui/system';

import shaunoAvatar from '../../../assets/images/shaunoAvatar.png';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

// Syled Components
const UserContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    margin: 'auto',
    width: '100%',
    maxWidth: '800px',
    height: '50%',
    backgroundColor: theme.palette.background.paper,
}));

const AvatarContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(4),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 96,
    height: 100,
    margin: theme.spacing(1),
    alignSelf: 'center',
}));

const TextFieldContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'center',
}));

const Username = styled(Typography)(({ theme }) => ({
    fontSize: '2rem',
    marginLeft: theme.spacing(3),
    color: theme.palette.secondary.dark,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    margin: theme.spacing(1),
    width: '80%',
    borderRadius: '5px',
    padding: 0,
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.secondary.light,
        },
        '&.Mui-disabled fieldset': {
            border: `2px solid ${theme.palette.secondary.dark}`,
        },
        '&:not(.Mui-disabled):hover fieldset': {
            borderColor: theme.palette.secondary.light,
        },
    },
    '& label.Mui-focused': {
        color: theme.palette.secondary.light,
    },
    '& .MuiInputLabel-outlined': {
        color: theme.palette.secondary.dark,
    },
}));

const User = () => {
    const [isEditing, setIsEditing] = useState(false);
    const { idToken } = useContext(AuthContext);
    const { handleSave, profileData, setProfileData } =
        useContext(ProfileContext);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await fetch(`${backendUrl}/profile`, {
                    method: 'GET',
                    headers: {
                        Authorization: idToken,
                    },
                    credentials: 'include',
                });

                const data = await response.json();
                setProfileData(data);
            } catch (error) {
                console.log(error);
            }
        };
        loadProfile();
    }, [idToken, setProfileData]);

    return (
        <UserContainer elevation={9}>
            <AvatarContainer>
                <StyledAvatar alt="User Avatar" src={shaunoAvatar} />
                <Box
                    sx={{ display: 'flex', alignItems: 'center' }}
                    onClick={() => setIsEditing(true)}
                >
                    {isEditing ? (
                        <StyledTextField
                            size="small"
                            value={profileData.username}
                            type="text"
                            variant="outlined"
                            onChange={(e) =>
                                setProfileData({
                                    ...profileData,
                                    username: e.target.value,
                                })
                            }
                            onBlur={() => {
                                setIsEditing(false);
                                handleSave('username', profileData.username);
                            }}
                        />
                    ) : (
                        <Username variant="body1">
                            {profileData.username}
                        </Username>
                    )}
                </Box>
            </AvatarContainer>
            <TextFieldContainer>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <StyledTextField
                        size="small"
                        value={profileData.first_name}
                        label={!profileData.first_name ? 'First Name' : null}
                        type="text"
                        variant="outlined"
                        onChange={(e) =>
                            setProfileData({
                                ...profileData,
                                first_name: e.target.value,
                            })
                        }
                    />
                    <StyledTextField
                        size="small"
                        value={profileData.last_name}
                        label={!profileData.last_name ? 'Last Name' : null}
                        type="text"
                        variant="outlined"
                        onChange={(e) =>
                            setProfileData({
                                ...profileData,
                                last_name: e.target.value,
                            })
                        }
                    />
                </Box>
                <StyledTextField
                    size="small"
                    label="Serpapi Key"
                    type="password"
                    variant="outlined"
                    onChange={(e) =>
                        setProfileData({
                            ...profileData,
                            serp_key: e.target.value,
                        })
                    }
                />
                <StyledTextField
                    size="small"
                    label="OpenAI Key"
                    type="password"
                    variant="outlined"
                    onChange={(e) =>
                        setProfileData({
                            ...profileData,
                            open_key: e.target.value,
                        })
                    }
                />
            </TextFieldContainer>
        </UserContainer>
    );
};

export default User;
