import { Avatar, Box, TextField, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useContext, useState } from "react";
import { ProfileContext } from "../ProfileContext";

import shaunoAvatar from "../../../assets/images/shaunoAvatar.png";

// Syled Components
const UserContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
    margin: "auto",
    width: "100%",
    maxWidth: "800px",
    height: "50%",
    backgroundColor: theme.palette.background.paper,
}));

const AvatarContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: theme.spacing(4),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 96,
    height: 100,
    margin: theme.spacing(1),
    alignSelf: "center",
}));

const TextFieldContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    height: "100%",
    flexDirection: "column",
    justifyContent: "start",
    alignItems: "center",
}));

const Username = styled(Typography)(({ theme }) => ({
    fontSize: "2rem",
    marginLeft: theme.spacing(3),
    color: theme.palette.secondary.dark,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    margin: theme.spacing(1),
    width: "80%",
    borderRadius: "5px",
    padding: 0,
    "& .MuiOutlinedInput-root": {
        "&.Mui-focused fieldset": {
            borderColor: theme.palette.secondary.light,
        },
        "&.Mui-disabled fieldset": {
            border: `2px solid ${theme.palette.secondary.dark}`,
        },
        "&:not(.Mui-disabled):hover fieldset": {
            borderColor: theme.palette.secondary.light,
        },
    },
    "& label.Mui-focused": {
        color: theme.palette.secondary.light,
    },
    "& .MuiInputLabel-outlined": {
        color: theme.palette.secondary.dark,
    },
}));

const User = () => {
    const [isEditing, setIsEditing] = useState(false);
    const { profileData, setProfileData } = useContext(ProfileContext);

    return (
        <UserContainer id="user-container" elevation={9}>
            <AvatarContainer id="avatar-container">
                <StyledAvatar alt="User Avatar" src={shaunoAvatar} />
                <Box
                    sx={{ display: "flex", alignItems: "center" }}
                    onClick={() => setIsEditing(true)}
                >
                    {isEditing ? (
                        <StyledTextField
                            autoFocus
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
                            }}
                        />
                    ) : (
                        <Username variant="body1">
                            {profileData.username}
                        </Username>
                    )}
                </Box>
            </AvatarContainer>
            <TextFieldContainer id="details-container">
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <StyledTextField
                        size="small"
                        value={profileData.first_name}
                        label={!profileData.first_name ? "First Name" : null}
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
                        label={!profileData.last_name ? "Last Name" : null}
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
