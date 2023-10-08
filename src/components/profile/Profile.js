import React from 'react';
import User from './User';
import Questions from './Questions';
import { styled, Box } from '@mui/system';

const MainContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100%',
}));

const Profile = () => {
    return (
        <MainContainer>
            <User />
            <Questions />
        </MainContainer>
    );
};

export default Profile;
