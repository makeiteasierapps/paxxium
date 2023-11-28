import { useContext } from 'react';
import User from './User';
import Questions from './Questions';
import { styled } from '@mui/material/styles';
import { Paper, Box, Button } from '@mui/material';
import { ProfileContext } from '../../../contexts/ProfileContext';

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

const Profile = () => {
    const { handleSave, handleFormSubmit,  } =
        useContext(ProfileContext);

    const handleUpdate = async () => {
        await handleSave();
        await handleFormSubmit();
    };

    return (
        <MainContainer>
            <User />
            <Questions />
                <Button
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
