import React, { useContext, useState } from 'react';
import { styled } from '@mui/system';
import { TextField, Button, Box, FormGroup } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';
import { ChatContext } from '../../contexts/ChatContext';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const FormContainer = styled(FormGroup)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: theme.spacing(2),
}));

function DebateSettings() {
    const [topic, setTopic] = useState('');
    const [role1Description, setRole1Description] = useState('');
    const [role2Description, setRole2Description] = useState('');
    const { idToken } = useContext(AuthContext);
    const { addAgent } = useContext(ChatContext);

    const handleTopicChange = (event) => setTopic(event.target.value);

    const handleRole1DescriptionChange = (event) =>
        setRole1Description(event.target.value);

    const handleRole2DescriptionChange = (event) =>
        setRole2Description(event.target.value);

    const createDebate = async () => {
        try {
            const response = await fetch(`${backendUrl}/debate/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: idToken,
                },
                credentials: 'include',
                body: JSON.stringify({
                    role_1: role1Description,
                    role_2: role2Description,
                    topic: topic,
                }),
            });
            const data = await response.json();
            const newDebate = data;
            addAgent(newDebate);
            
        } catch (error) {
            console.error('Failed to start debate:', error);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        createDebate();
    };

    return (
        <FormContainer>
            <TextField
                sx={{ paddingBottom: '1rem' }}
                id="debate-topic-input"
                label="Debate Topic"
                variant="outlined"
                multiline
                rows={2}
                value={topic}
                onChange={handleTopicChange}
            />
            <TextField
                sx={{ paddingBottom: '1rem' }}
                id="role1-description-input"
                label="Role 1 Description"
                variant="outlined"
                multiline
                rows={2}
                value={role1Description}
                onChange={handleRole1DescriptionChange}
            />
            <TextField
                sx={{ paddingBottom: '1rem' }}
                id="role2-description-input"
                label="Role 2 Description"
                variant="outlined"
                multiline
                rows={2}
                value={role2Description}
                onChange={handleRole2DescriptionChange}
            />
            <Button type="submit" variant="contained" onClick={handleSubmit}>
                Start Debate
            </Button>
        </FormContainer>
    );
}

export default DebateSettings;
