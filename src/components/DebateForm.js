import React, { useContext, useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { TextField, Button, Box } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import { ChatContext } from '../contexts/ChatContext';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const FormContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: theme.spacing(2),
}));

function DebateSetupForm() {
    const [topic, setTopic] = React.useState('');
    const [role1Description, setRole1Description] = React.useState('');
    const [role2Description, setRole2Description] = React.useState('');
    const { idToken } = useContext(AuthContext);
    const {
        uid,
        setSelectedAgentId,
        setSelectedAgentName,
        setConversationId,
        conversationList,
        addConversation,
        setMessages,
    } = useContext(ChatContext);

    const handleTopicChange = (event) => setTopic(event.target.value);

    const handleRole1DescriptionChange = (event) =>
        setRole1Description(event.target.value);

    const handleRole2DescriptionChange = (event) =>
        setRole2Description(event.target.value);

    const addMessageToConversation = async (messageContent) => {
        const newMessage = {
            message_content: messageContent,
            message_from: 'chatbot',
            user_id: uid,
            agent_id: '333',
            time_stamp: new Date().toISOString(),
        };

        // Add the new message to the global messages state
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const startDebate = async (turn = 0) => {
            try {
                const response = await fetch(
                    `${backendUrl}/start_debate`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: idToken,
                        },
                        body: JSON.stringify({
                            role_1: role1Description,
                            role_2: role2Description,
                            topic: topic,
                            turn: turn,
                        }),
                    }
                );
                const data = await response.json();
                const newConversation = data.conversation;
                setConversationId(newConversation.id);
                setSelectedAgentId(newConversation.agent_id);
                
                if (turn === 0) {
                    addConversation(newConversation);
                }

                setSelectedAgentName(newConversation.agent_name);
                addMessageToConversation(data.message);

                if (data.hasMoreTurns) {
                    startDebate(turn + 1);
                }
            } catch (error) {
                console.error('Failed to start debate:', error);
            }
        };

        // Start the debate
        startDebate();
    };

    return (
        <FormContainer component="form" onSubmit={handleSubmit}>
            <TextField
                id="debate-topic-input"
                label="Debate Topic"
                variant="outlined"
                value={topic}
                onChange={handleTopicChange}
            />
            <TextField
                id="role1-description-input"
                label="Role 1 Description"
                variant="outlined"
                multiline
                rows={4}
                value={role1Description}
                onChange={handleRole1DescriptionChange}
            />
            <TextField
                id="role2-description-input"
                label="Role 2 Description"
                variant="outlined"
                multiline
                rows={4}
                value={role2Description}
                onChange={handleRole2DescriptionChange}
            />
            <Button type="submit" variant="contained">
                Start Debate
            </Button>
        </FormContainer>
    );
}

export default DebateSetupForm;
