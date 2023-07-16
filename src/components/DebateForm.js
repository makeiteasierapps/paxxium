import React, { useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { styled } from '@mui/system';
import { TextField, Button, Box } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import { ChatContext } from '../contexts/ChatContext';

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
    const [socket, setSocket] = useState(null);
    const { idToken } = useContext(AuthContext);
    const {
        setSelectedAgentId,
        setSelectedAgentName,
        setConversationId,
        conversationId,
        addConversation,
        setMessages,
        selectedAgentId,
        userId,
    } = useContext(ChatContext);

    useEffect(() => {
        // Establish the socket connection
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        // Define your event handlers
        const handleIncomingMessage = (message) => {
            console.log('Received message:', message);
            // Construct a new message object using the received message
            const incomingMessage = {
                message_content: message.message_content,
                message_from: 'user',
                user_id: userId,
                agent_id: selectedAgentId,
                time_stamp: new Date().toISOString(),
            };

            // Add the incoming message to the list
            setMessages((prevMessages) => [...prevMessages, incomingMessage]);
        };

        const handleDebateStarted = (data) => {
            console.log('Debate started:', data);
            const newConversation = data.conversation;
            setConversationId(newConversation.id);
            addConversation(newConversation);
            setSelectedAgentId(newConversation.agent_id);
            setSelectedAgentName(newConversation.agent_name);
        };

        // Set up your event listeners
        newSocket.on('new_message', handleIncomingMessage);
        newSocket.on('debate_started', handleDebateStarted);

        // Clean up function to be run when the component is unmounted
        return () => {
            newSocket.off('new_message', handleIncomingMessage);
            newSocket.off('debate_started', handleDebateStarted);
            newSocket.close();
        };
    }, []);

    const handleTopicChange = (event) => setTopic(event.target.value);
    const handleRole1DescriptionChange = (event) =>
        setRole1Description(event.target.value);
    const handleRole2DescriptionChange = (event) =>
        setRole2Description(event.target.value);


    const handleSubmit = (event) => {
        event.preventDefault();

        // Ensure socket is connected
        if (!socket) return;

        // Join room and then emit start_debate
        socket.emit('join', { room: conversationId });
        socket.emit('start_debate', {
            idToken: idToken,
            role_1: role1Description,
            role_2: role2Description,
            topic: topic,
        });
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
