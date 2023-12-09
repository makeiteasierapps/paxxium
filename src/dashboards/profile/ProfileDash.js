import { useContext } from 'react';
import User from './components/User';
import Questions from './components/Questions';
import { styled } from '@mui/material/styles';
import { Paper, Button, Box } from '@mui/material';
import { ProfileContext } from './ProfileContext';
import { AuthContext } from '../../contexts/AuthContext';
import {
    handleUserUpdate,
    handleQuestionsUpdate,
} from './handlers/profileHandlers';

const MainContainer = styled(Paper)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    margin: 'auto',
    width: '100%',
    maxWidth: '800px',
    height: '100%',
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
        <MainContainer>
            <User />
            <Questions />
            <Button
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
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                }}
            >
                {analysis ? analysis : 'Analyze Profile'}
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
