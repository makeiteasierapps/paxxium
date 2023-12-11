import { Box, Button, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { ProfileContext } from "./ProfileContext";
import Questions from "./components/Questions";
import User from "./components/User";
import {
    handleQuestionsUpdate,
    handleUserUpdate,
} from "./handlers/profileHandlers";

const MainContainer = styled(Paper)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: "800px",
    backgroundColor: theme.palette.background.paper,
}));

const ProfileDash = () => {
    const { handleAnalyzeProfile, analysis, profileData, answers } =
        useContext(ProfileContext);

    const { idToken } = useContext(AuthContext);

    const handleUpdate = async (
        idToken = null,
        profileData = null,
        answers = null
    ) => {
        await handleUserUpdate(idToken, profileData);
        await handleQuestionsUpdate(idToken, answers);
    };

    return (
        <MainContainer id="main-container">
            <User />
            <Questions />
            <Button
                id="update-profile-button"
                variant="contained"
                onClick={() => handleUpdate(idToken, profileData, answers)}
                sx={{ margin: 3 }}
            >
                Save
            </Button>
            <Box
                sx={{
                    margin: 3,
                    padding: 2,
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                }}
            >
                {analysis ? analysis : "Analyze Profile"}
            </Box>
            <Button
                variant="contained"
                onClick={handleAnalyzeProfile}
                sx={{ margin: 3 }}
            >
                Analyze
            </Button>
        </MainContainer>
    );
};

export default ProfileDash;
