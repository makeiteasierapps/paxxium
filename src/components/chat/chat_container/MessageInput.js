import React, { useContext, useState, useEffect, useRef } from 'react';
import Prism from 'prismjs';
import io from 'socket.io-client';
import 'prismjs/components/prism-javascript.min';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-okaidia.css';
import { ChatContext } from '../../../contexts/ChatContext';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/system';
import { AuthContext } from '../../../contexts/AuthContext';

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const InputArea = styled('div')({
    padding: '20px',
    display: 'flex',
    alignItems: 'center', // Vertically center children
    justifyContent: 'space-between',
});

const MessageInput = ({
    chatId,
    agentModel,

    setMessages,
}) => {
    const { uid } = useContext(ChatContext);
    const { idToken } = useContext(AuthContext);
    const [input, setInput] = useState('');
    const socketRef = useRef(null);

    // Set up the socket connection on mount and disconnect on unmount.
    useEffect(() => {
        socketRef.current = io.connect(backendUrl);

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const sendMessage = () => {
        // Optomistic update
        const userMessage = {
            message_content: input,
            message_from: 'user',
            user_id: uid,
            time_stamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput(''); // clear the input field

        // Emit the 'message' event to the server
        socketRef.current.emit('message', {
            idToken: idToken,
            chatId: chatId,
            message_content: input,
            message_from: 'user',
            user_id: uid,
            agentModel: agentModel,
        });
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
