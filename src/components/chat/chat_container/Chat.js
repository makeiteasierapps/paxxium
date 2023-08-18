import React, { useRef, useContext, useEffect, useState, useCallback } from 'react';
import { styled } from '@mui/system';
import { List, Box, Typography, IconButton } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import CommentsDisabledIcon from '@mui/icons-material/CommentsDisabled';

import MessagesContainer from './MessagesContainer';
import AgentMessage from './AgentMessage';
import UserMessage from './UserMessage';
import MessageInput from './MessageInput';

import { AuthContext } from '../../../contexts/AuthContext';
import { ChatContext } from '../../../contexts/ChatContext';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

// STYLED COMPONENTS
const ChatContainerStyled = styled(Box)(({ theme }) => ({
    marginLeft: '20px',
    marginTop: '20px',
    height: '800px',
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
    overflow: 'auto',
}));

const ChatBar = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderBottom: '1px solid #e0e0e0',
}));

const ChatBarIcons = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
}));

const MessageArea = styled(List)({
    flexGrow: 1,
    overflowY: 'auto',
    width: '100%',
});
// -----------------------------

// This is the component for "Start A New Conversation"
// const StartNewConversation = () => (
//     <div
//         style={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             zIndex: 2,
//         }}
//     >
//         Start A New Conversation
//     </div>
// );

const Chat = ({id, chatConstants, systemPrompt, chatName, agentModel, useProfileData}) => {
    const lastIndexProcessed = useRef(-1);
    const messagesEndRef = useRef(null);
    const { setChatArray, chatArray } = useContext(ChatContext);
    const { idToken } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);

    // Fetch messages from the database
    const fetchMessages = useCallback(async () => {
        try {
            const requestData = {
                id,
                chatConstants,
                systemPrompt,
                chatName,
                agentModel,
                useProfileData
            };
            const url = `${backendUrl}/${id}/messages`;
            const messageResponse = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: idToken,
                },
                credentials: 'include',
                body: JSON.stringify(requestData),
            });
            if (!messageResponse.ok) {
                throw new Error('Failed to load messages');
            }

            const messageData = await messageResponse.json();
            if (messageData && messageData.messages.length > 0) {
                setMessages(messageData.messages);
            } else {
                setMessages([]);
            }
        } catch (error) {
            console.error(error);
        }
    }, [id, chatConstants, systemPrompt, chatName, agentModel, useProfileData, idToken, setMessages]);
    
    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(scrollToBottom, [messages]);

    const handleClearMessages = async () => {
        try{
            const response = await fetch(`${backendUrl}/${id}/messages/clear`, {
                method: 'DELETE',
                headers: { Authorization: idToken },
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to clear messages');
            setMessages([]);
        } catch (error) {
            console.error(error);
        }

    };
    const handleDeleteChat = async () => {
        try {
            const response = await fetch(`${backendUrl}/chat/${id}/delete`, {
                method: 'DELETE',
                headers: { Authorization: idToken },
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to delete conversation');
            setChatArray((prevChatArray) =>
            prevChatArray.filter((chatObj) => chatObj.id !== id)
        );
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ChatContainerStyled>
            <ChatBar>
                <Typography variant="h6">{chatName}</Typography>
                <ChatBarIcons>
                    <IconButton
                        aria-label="clear_chat"
                        onClick={handleClearMessages}
                    >
                        <CommentsDisabledIcon />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={handleDeleteChat}>
                        <DeleteIcon />
                    </IconButton>
                </ChatBarIcons>
            </ChatBar>
            <MessagesContainer item xs={9}>
                <MessageArea>
                    {messages.map((message, index) => {
                        if (message) {
                            if (typeof message === 'string') {
                                // This is a streaming message
                                if (index <= lastIndexProcessed.current) {
                                    return null;
                                } else if (index > lastIndexProcessed.current) {
                                    console.log('Streaming message', message);
                                    lastIndexProcessed.current = index;
                                    return (
                                        <AgentMessage
                                            key={message.time_stamp}
                                            message={message}
                                        />
                                    );
                                }
                                // These are message objects loaded from the database or on refresh.
                            } else if (message.message_from === 'chatbot') {
                                return (
                                    <AgentMessage
                                        key={index}
                                        message={message}
                                    />
                                );
                            } else if (message.message_from === 'user') {
                                return (
                                    <UserMessage
                                        key={index}
                                        message={message}
                                    />
                                );
                            }
                        }
                        return null; // return null when the message doesn't exist
                    })}
                    <div ref={messagesEndRef} />
                </MessageArea>
                <MessageInput
                    chatId={id}
                    agentModel={agentModel}
                    systemPrompt={systemPrompt}
                    chatConstants={chatConstants}
                    setMessages={setMessages}
                />
            </MessagesContainer>
        </ChatContainerStyled>
    );
};

export default Chat;
