import { Button, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useContext } from "react";
import { ProfileContext } from "../../../contexts/ProfileContext";
import Questions from "./Questions";
import User from "./User";

const MainContainer = styled(Paper)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: "800px",
    backgroundColor: theme.palette.background.paper,
}));

const Profile = () => {
    const { handleSave, handleFormSubmit } = useContext(ProfileContext);

    const handleUpdate = async () => {
        await handleSave();
        await handleFormSubmit();
    };

    return (
        <MainContainer id="main-container">
            <User />
            <Questions />
            <Button
                id="update-profile-button"
                variant="contained"
                onClick={handleUpdate}
                sx={{ margin: 3 }}
            >
                Update
            </Button>
        </MainContainer>
    );
};

export default Profile;
