import React, { useRef, useContext, useEffect, useCallback, memo, useState } from 'react';
import { styled } from '@mui/system';
import { List, Box } from '@mui/material';
import io from 'socket.io-client';
import AgentMessage from './AgentMessage';
import UserMessage from './UserMessage';
import MessageInput from './MessageInput';
import ChatBar from './ChatBar';
import { AuthContext } from '../../../../contexts/AuthContext';
import { ChatContext } from '../../../../contexts/ChatContext';
import { SettingsContext } from '../../../../contexts/SettingsContext';

import { handleIncomingMessageStream } from '../chat_container/handlers/handleIncomingMessageStream';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

// STYLED COMPONENTS
const ChatContainerStyled = styled(Box)(({ theme }) => ({
    height: '80vh',
    width: '70%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.63)',
    overflow: 'auto',
    borderRadius: '5px',
}));

const MessageArea = styled(List)({
    flexGrow: 1,
    overflowY: 'auto',
    width: '100%',
});

const MessagesContainer = styled('div')({
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    whiteSpace: 'pre-line',
});

const Chat = ({
    id,
    chatConstants,
    systemPrompt,
    chatName,
    agentModel,
    useProfileData,
}) => {
    const socketRef = useRef(null);
    const { setAgentArray, messageParts, setMessageParts, setInsideCodeBlock } =
        useContext(ChatContext);
    const { idToken } = useContext(AuthContext);
    const { setSettings } = useContext(SettingsContext);

    const [backtickCount, setBacktickCount] = useState(0);

    // Fetch messages from the database
    const fetchMessages = useCallback(async () => {
        try {
            const requestData = {
                id,
                chatConstants,
                systemPrompt,
                chatName,
                agentModel,
                useProfileData,
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
                setMessageParts((prevMessageParts) => ({
                    ...prevMessageParts,
                    [id]: messageData.messages,
                }));
            }
        } catch (error) {
            console.error(error);
        }
    }, [
        id,
        chatConstants,
        systemPrompt,
        chatName,
        agentModel,
        useProfileData,
        idToken,
        setMessageParts,
    ]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const handleToken = useCallback(
        (token) => {
            setMessageParts((prevMessage) => {
                const newMessageParts = handleIncomingMessageStream(
                    prevMessage,
                    id,
                    token,
                    setInsideCodeBlock,
                    backtickCount,
                    setBacktickCount
                );
                return newMessageParts;
            });
        },
        [setMessageParts, id, setInsideCodeBlock, backtickCount]
    );

    useEffect(() => {
        socketRef.current = io.connect(backendUrl);
        // Join the room after connection.
        socketRef.current.emit('join', { room: id });
        // Register the event listener for incoming tokens.
        socketRef.current.on('token', handleToken);

        // Clean up by removing the event listener when the component is unmounted.
        return () => {
            socketRef.current.off('token', handleToken);
        };
    }, [handleToken, id]);

    return (
        <ChatContainerStyled
            onClick={() => {
                setSettings({
                    id,
                    agentModel,
                    systemPrompt,
                    chatConstants,
                    useProfileData,
                    chatName,
                });
            }}
        >
            <ChatBar
                chatName={chatName}
                id={id}
                idToken={idToken}
                setAgentArray={setAgentArray}
                backendUrl={backendUrl}
            />
            <MessagesContainer item xs={9}>
                <MessageArea>
                    {messageParts[id]?.map((message, index) => {
                        if (message.type === 'database') {
                            if (message.message_from === 'agent') {
                                return (
                                    <AgentMessage
                                        key={`agent${index}`}
                                        message={message}
                                    />
                                );
                            } else {
                                return (
                                    <UserMessage
                                        key={`user${index}`}
                                        message={message}
                                    />
                                );
                            }
                        } else if (message.type === 'stream') {
                            return (
                                <AgentMessage
                                    key={`stream${index}`}
                                    message={message}
                                />
                            );
                        }
                    })}
                </MessageArea>
                <MessageInput
                    chatId={id}
                    agentModel={agentModel}
                    systemPrompt={systemPrompt}
                    chatConstants={chatConstants}
                />
            </MessagesContainer>
        </ChatContainerStyled>
    );
};

export default memo(Chat);
