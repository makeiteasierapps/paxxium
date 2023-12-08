import React, { useRef, useState, useContext, useEffect, memo } from 'react';
import { styled } from '@mui/system';
import { List, Box } from '@mui/material';
import io from 'socket.io-client';
import AgentMessage from './AgentMessage';
import UserMessage from './UserMessage';
import MessageInput from './MessageInput';
import ChatBar from './ChatBar';
import { AuthContext } from '../../../../contexts/AuthContext';
import { ChatContext } from '../../../../contexts/ChatContext';
import { formatBlockMessage } from '../utils/messageFormatter';
import { handleIncomingMessageStream } from '../chat_container/handlers/handleIncomingMessageStream';
import { processToken } from '../utils/processToken';
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

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Chat = ({
    id,
    chatConstants,
    systemPrompt,
    chatName,
    agentModel,
    useProfileData,
}) => {
    const socketRef = useRef(null);
    const [queue, setQueue] = useState([]);
    const ignoreNextTokenRef = useRef(false);
    const languageRef = useRef('markdown');

    const {
        messages,
        setMessages,
        setInsideCodeBlock,
        insideCodeBlock,
        setSelectedAgent,
        agentArray,
    } = useContext(ChatContext);

    const { idToken } = useContext(AuthContext);

    // Fetch messages from the database
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const requestData = {
                    id,
                    chatConstants,
                    systemPrompt,
                    chatName,
                    agentModel,
                    useProfileData,
                };

                const messageResponse = await fetch(
                    `${backendUrl}/${id}/messages`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: idToken,
                        },
                        credentials: 'include',
                        body: JSON.stringify(requestData),
                    }
                );

                if (!messageResponse.ok) {
                    throw new Error('Failed to load messages');
                }

                const messageData = await messageResponse.json();
                if (messageData && messageData.messages.length > 0) {
                    setMessages((prevMessageParts) => ({
                        ...prevMessageParts,
                        [id]: messageData.messages,
                    }));
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchMessages();
    }, [
        agentModel,
        chatConstants,
        chatName,
        id,
        idToken,
        setMessages,
        systemPrompt,
        useProfileData,
    ]);

    useEffect(() => {
        const handleToken = (token) => {
            setQueue((prevQueue) => [...prevQueue, token]);
        };

        socketRef.current = io.connect(backendUrl);
        socketRef.current.emit('join', { room: id });
        socketRef.current.on('token', handleToken);

        return () => {
            socketRef.current.off('token', handleToken);
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [id]);

    useEffect(() => {
        if (queue.length > 0) {
            processToken(
                queue[0],
                setInsideCodeBlock,
                insideCodeBlock,
                setMessages,
                handleIncomingMessageStream,
                id,
                ignoreNextTokenRef,
                languageRef
            );

            setQueue((prevQueue) => prevQueue.slice(1));
        }
    }, [queue, setMessages, setInsideCodeBlock, insideCodeBlock, id]);

    return (
        <ChatContainerStyled
            onClick={() => {
                const selectedAgent = agentArray.find(
                    (agent) => agent.id === id
                );
                setSelectedAgent(selectedAgent);
            }}
        >
            <ChatBar
                chatName={chatName}
                id={id}
                idToken={idToken}
                backendUrl={backendUrl}
            />
            <MessagesContainer item xs={9}>
                <MessageArea>
                    {messages[id]?.map((message, index) => {
                        let formattedMessage = message;
                        if (message.type === 'database') {
                            console.log('message', message);
                            if (message.message_from === 'agent') {
                                
                                formattedMessage = formatBlockMessage(message);
                                return (
                                    <AgentMessage
                                        key={`agent${index}`}
                                        message={formattedMessage}
                                        id={id}
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
                        } else {
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
