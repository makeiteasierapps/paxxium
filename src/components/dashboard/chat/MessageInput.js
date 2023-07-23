import React, { useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatContext } from '../../../contexts/ChatContext';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/system';
import { AuthContext } from '../../../contexts/AuthContext';

const InputArea = styled('div')({
    padding: '20px',
    display: 'flex',
    alignItems: 'center', // Vertically center children
    justifyContent: 'space-between',
});

const MessageInput = () => {
    const { selectedAgentId, selectedAgentName, uid, conversationId, setMessages } =
        useContext(ChatContext);
    const { idToken } = useContext(AuthContext);
    const [input, setInput] = useState('');
    const [error, setError] = useState(null);

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const sendMessage = async () => {
        const tempId = uuidv4(); // generate a temporary unique id

        // Optomistic update
        const userMessage = {
            message_content: input,
            message_from: 'user',
            user_id: uid,
            agent_id: selectedAgentId, 
            time_stamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        const url = `http://localhost:5000/${conversationId}/messages`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: idToken,
                },
                body: JSON.stringify({
                    message_content: input,
                    message_from: 'user',
                    user_id: uid,
                    agent_id: selectedAgentId,
                    agent_name: selectedAgentName,
                }),
            });

            setInput(''); // clear the input field

            if (!response.ok) throw new Error('Failed to send message');

            const data = await response.json();
            const [newMessage, responseFromLlm] = data;

            // If the server returns a new version of the user's message and a bot's response
            if (newMessage && responseFromLlm) {
                setMessages((prevMessages) => {
                    const updatedMessages = prevMessages.map((message) =>
                        message.id === tempId ? newMessage : message
                    );
                    updatedMessages.push(responseFromLlm);
                    return updatedMessages;
                });
            }
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && input.trim() !== '') {
            sendMessage();
        }
    };

    return (
        <InputArea>
            <TextField
                id="outlined-basic-email"
                label="Type Something"
                fullWidth
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                color="primary"
                                aria-label="send message"
                                onClick={sendMessage}
                            >
                                <SendIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </InputArea>
    );
};

export default MessageInput;
