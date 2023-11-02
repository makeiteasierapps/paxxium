import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';

import {
    TextField,
    IconButton,
    InputAdornment,
    Avatar,
    Box,
    Typography,
} from '@mui/material';
import { Check, Edit } from '@mui/icons-material';
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
    const { idToken } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState({
        avatar: false,
        username: false,
        serpapi: false,
        openai: false,
        first_name: false,
        last_name: false,
    });
    const [isHovered, setIsHovered] = useState({
        avatar: false,
        username: false,
        serpapi: false,
        openai: false,
        first_name: false,
        last_name: false,
    });
    const [profileData, setProfileData] = useState({});

    // Handlers
    const handleEdit = (field) => {
        setIsEditing({ ...isEditing, [field]: true });
    };

    const handleSave = (field, value) => {
        setProfileData((prevData) => ({ ...prevData, [field]: value }));
    };

    const handleEditDone = async (field) => {
        await fetch(`${backendUrl}/profile/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: idToken,
            },
            body: JSON.stringify({
                [field]: profileData[field],
            }),
        });
        setIsEditing({ ...isEditing, [field]: false });
    };

    
    // I set this timer here so that the edit icon doesnt show up right away
    // creates a better user experience by showing the edit icon when the user
    // shows intent to edit
    let timer = useRef();

    const handleMouseEnter = (field) => {
        timer.current = setTimeout(() => {
            setIsHovered((prevHovered) => ({ ...prevHovered, [field]: true }));
        }, 500);
    };

    const handleMouseLeave = (field) => {
        clearTimeout(timer.current);
        setIsHovered((prevHovered) => ({ ...prevHovered, [field]: false }));
    };

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
    }, [idToken]);

    return (
        <UserContainer elevation={9}>
            <AvatarContainer>
                <StyledAvatar alt="User Avatar" src={shaunoAvatar} />
                {isEditing.username ? (
                    <TextField
                        value={profileData.username}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {isEditing.username ? (
                                        <IconButton
                                            onClick={() =>
                                                handleEditDone('username')
                                            }
                                        >
                                            <Check />
                                        </IconButton>
                                    ) : (
                                        <IconButton
                                            onClick={() =>
                                                handleEdit('username')
                                            }
                                        >
                                            <Edit />
                                        </IconButton>
                                    )}
                                </InputAdornment>
                            ),
                        }}
                        onChange={(e) => handleSave('username', e.target.value)}
                    />
                ) : (
                    <Box
                        sx={{ display: 'flex', alignItems: 'center' }}
                        onMouseEnter={() => handleMouseEnter('username')}
                        onMouseLeave={() => handleMouseLeave('username')}
                    >
                        <Username variant="body1">
                            {profileData.username}
                        </Username>
                        <IconButton onClick={() => handleEdit('username')}>
                            <Edit
                                style={{
                                    visibility: isHovered.username
                                        ? 'visible'
                                        : 'hidden',
                                }}
                            />
                        </IconButton>
                    </Box>
                )}
            </AvatarContainer>
            <TextFieldContainer>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <StyledTextField
                        size="small"
                        value={profileData.first_name}
                        label={!profileData.first_name ? 'First Name' : null}
                        type="text"
                        variant="outlined"
                        disabled={!isEditing.first_name}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {isEditing.first_name ? (
                                        <IconButton
                                            onClick={() =>
                                                handleEditDone('first_name')
                                            }
                                        >
                                            <Check />
                                        </IconButton>
                                    ) : (
                                        <IconButton
                                            onClick={() =>
                                                handleEdit('first_name')
                                            }
                                            style={{
                                                visibility: isHovered.first_name
                                                    ? 'visible'
                                                    : 'hidden',
                                            }}
                                        >
                                            <Edit />
                                        </IconButton>
                                    )}
                                </InputAdornment>
                            ),
                        }}
                        onChange={(e) =>
                            handleSave('first_name', e.target.value)
                        }
                        onMouseEnter={() => handleMouseEnter('first_name')}
                        onMouseLeave={() => handleMouseLeave('first_name')}
                    />
                    <StyledTextField
                        size="small"
                        value={profileData.last_name}
                        label={!profileData.last_name ? 'Last Name' : null}
                        type="text"
                        disabled={!isEditing.last_name}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {isEditing.last_name ? (
                                        <IconButton
                                            onClick={() =>
                                                handleEditDone('last_name')
                                            }
                                        >
                                            <Check />
                                        </IconButton>
                                    ) : (
                                        <IconButton
                                            onClick={() =>
                                                handleEdit('last_name')
                                            }
                                            style={{
                                                visibility: isHovered.last_name
                                                    ? 'visible'
                                                    : 'hidden',
                                            }}
                                        >
                                            <Edit />
                                        </IconButton>
                                    )}
                                </InputAdornment>
                            ),
                        }}
                        onChange={(e) =>
                            handleSave('last_name', e.target.value)
                        }
                        onMouseEnter={() => handleMouseEnter('last_name')}
                        onMouseLeave={() => handleMouseLeave('last_name')}
                    />
                </Box>
                <StyledTextField
                    size="small"
                    label="Serpapi Key"
                    type="password"
                    disabled={!isEditing.serpapi}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {isEditing.serpapi ? (
                                    <IconButton
                                        onClick={() =>
                                            handleEditDone('serpapi')
                                        }
                                    >
                                        <Check />
                                    </IconButton>
                                ) : (
                                    <IconButton
                                        onClick={() => handleEdit('serpapi')}
                                        style={{
                                            visibility: isHovered.serpapi
                                                ? 'visible'
                                                : 'hidden',
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                )}
                            </InputAdornment>
                        ),
                    }}
                    onChange={(e) => handleSave('serpapi', e.target.value)}
                    onMouseEnter={() => handleMouseEnter('serpapi')}
                    onMouseLeave={() => handleMouseLeave('serpapi')}
                />
                <StyledTextField
                    size="small"
                    label="OpenAI Key"
                    type="password"
                    disabled={!isEditing.openai}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {isEditing.openai ? (
                                    <IconButton
                                        onClick={() => handleEditDone('openai')}
                                    >
                                        <Check />
                                    </IconButton>
                                ) : (
                                    <IconButton
                                        onClick={() => handleEdit('openai')}
                                        style={{
                                            visibility: isHovered.openai
                                                ? 'visible'
                                                : 'hidden',
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                )}
                            </InputAdornment>
                        ),
                    }}
                    onChange={(e) => handleSave('openai', e.target.value)}
                    onMouseEnter={() => handleMouseEnter('openai')}
                    onMouseLeave={() => handleMouseLeave('openai')}
                />
            </TextFieldContainer>
        </UserContainer>
    );
};

export default User;
