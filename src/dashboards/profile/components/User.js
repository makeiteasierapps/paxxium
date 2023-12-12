import { Box } from "@mui/material";
import { useContext, useState } from "react";
import { ProfileContext } from "../ProfileContext";

import shaunoAvatar from "../../../assets/images/shaunoAvatar.png";

import {UserContainer, AvatarContainer, StyledAvatar, StyledTextField, Username, TextFieldContainer} from "../styledProfileComponents";

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
