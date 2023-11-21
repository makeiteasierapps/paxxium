import React, { useContext, useState } from 'react';
import { styled } from '@mui/system';
import { TextField, Button, FormGroup } from '@mui/material';
import { AuthContext } from '../../../../contexts/AuthContext';
import { ChatContext } from '../../../../contexts/ChatContext';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

// Styled components
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
                onChange={(event) => setTopic(event.target.value)}
            />
            <TextField
                sx={{ paddingBottom: '1rem' }}
                id="role1-description-input"
                label="Role 1 Description"
                variant="outlined"
                multiline
                rows={2}
                value={role1Description}
                onChange={(event) => setRole1Description(event.target.value)}
            />
            <TextField
                sx={{ paddingBottom: '1rem' }}
                id="role2-description-input"
                label="Role 2 Description"
                variant="outlined"
                multiline
                rows={2}
                value={role2Description}
                onChange={(event) => setRole2Description(event.target.value)}
            />
            <Button
                type="submit"
                variant="contained"
                onClick={(event) => {
                    event.preventDefault();
                    createDebate();
                }}
            >
                Start Debate
            </Button>
        </FormContainer>
    );
}

export default DebateSettings;
