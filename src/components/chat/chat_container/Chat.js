import React, {
    useRef,
    useContext,
    useEffect,
    useState,
    useCallback,
} from 'react';

import { styled } from '@mui/system';
import { List, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import DeleteIcon from '@mui/icons-material/Delete';
import CommentsDisabledIcon from '@mui/icons-material/CommentsDisabled';

import io from 'socket.io-client';

import MessagesContainer from './MessagesContainer';
import AgentMessage from './AgentMessage';
import UserMessage from './UserMessage';
import MessageInput from './MessageInput';

import { AuthContext } from '../../../contexts/AuthContext';
import { ChatContext } from '../../../contexts/ChatContext';
import { highlightStringCode } from '../../../utils/ProcessResponse';
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

const Chat = ({
    id,
    chatConstants,
    systemPrompt,
    chatName,
    agentModel,
    useProfileData,
}) => {
    const isCodeBlockRef = useRef(false);
    const codeRef = useRef('');
    const langRef = useRef('markdown');
    const isLangLineRef = useRef(false);
    const tokenizedCodeRef = useRef([]);
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);
    const isProcessing = useRef(false);
    const tokenQueue = useRef([]);
    const ignoreNextToken = useRef(false);
    const isQueueProcessing = useRef(false);
    const { setAgentArray } = useContext(ChatContext);
    const { idToken } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [streamingMessageParts, setStreamingMessageParts] = useState([]);

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
                setMessages(messageData.messages);
            } else {
                setMessages([]);
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
    ]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    // Set up the socket connection on mount and disconnect on unmount.
    useEffect(() => {
        socketRef.current = io.connect(backendUrl);

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const processToken = useCallback(async (token) => {
        // Check if the token marks the start or end of a code block.
        if (token.startsWith('```') || token.startsWith('``')) {
            console.log('token', token);
            if (token.startsWith('``')) {
                ignoreNextToken.current = true;
            }

            if (isCodeBlockRef.current) {
                // End of a code block, reset variables for the next code block.
                const highlightedCode = highlightStringCode(
                    codeRef.current,
                    langRef.current
                );

                tokenizedCodeRef.current = highlightedCode
                    .split(/(<[^>]*>)|\b/)
                    .filter(Boolean);

                // Wait for all code parts to be processed before moving on
                for (
                    let index = 0;
                    index < tokenizedCodeRef.current.length;
                    index++
                ) {
                    await new Promise((resolve) =>
                        setTimeout(() => {
                            setStreamingMessageParts((prevParts) => [
                                ...prevParts,
                                {
                                    type: 'code',
                                    content: tokenizedCodeRef.current[index],
                                },
                            ]);
                            resolve();
                        }, 0)
                    );
                }

                // Reset the variables and flag after the highlighting process is complete
                tokenizedCodeRef.current = [];
                isCodeBlockRef.current = false;
                langRef.current = 'markdown';
                codeRef.current = '';
                isProcessing.current = false;
            } else {
                // Start of a code block.
                isProcessing.current = true;
                isCodeBlockRef.current = true;
                isLangLineRef.current = true;
            }
        } else if (isCodeBlockRef.current) {
            // Inside a code block.
            if (isLangLineRef.current) {
                // The first line of the code block may specify the language.
                langRef.current = token.trim() || 'markdown';
                if (langRef.current === 'jsx') {
                    langRef.current = 'javascript';
                }
                isLangLineRef.current = false;
            } else {
                // Add the token to the code block.
                codeRef.current += token;
            }
        } else {
            if (ignoreNextToken.current) {
                ignoreNextToken.current = false;
                return;
            }
            // This is a text token, add it to the streaming message parts.
            setStreamingMessageParts((prevParts) => {
                const updatedParts = [...prevParts];
                updatedParts.push({
                    type: 'text',
                    content: token,
                });
                return updatedParts;
            });
        }
        isProcessing.current = false;
    }, []);

    // Update the message state with the streamed message.
    useEffect(() => {
        const socket = io.connect(backendUrl);
        const handleMessage = async (message) => {
            setTimeout(() => {
                setMessages((prevMessages) => [...prevMessages, message]);
                setStreamingMessageParts([]);
            }, 100);
        };

        socket.on('message', (message) => {
            handleMessage(message);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const handleToken = async (token) => {
            if (id === token.chat_id) {
                if (isProcessing.current || isQueueProcessing.current) {
                    tokenQueue.current.push(token.token);
                    console.log('queue', tokenQueue.current);
                    return;
                }

                isProcessing.current = true;
                await processToken(token.token);
                isProcessing.current = false;

                if (tokenQueue.current.length > 0) {
                    isQueueProcessing.current = true;
                    const nextToken = tokenQueue.current.shift();
                    await processToken(nextToken);
                    isQueueProcessing.current = false;
                }
            }
        };

        // Register the event listener for incoming tokens.
        socketRef.current.on('token', handleToken);

        // Clean up by removing the event listener when the component is unmounted.
        return () => {
            socketRef.current.off('token', handleToken);
        };
    }, [id, processToken]);

    // const scrollToBottom = () => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    // };
    // useEffect(scrollToBottom, [messages]);

    // CHATBAR BUTTON HANDLERS
    const handleCloseChat = () => {
        setAgentArray((prevChatArray) =>
            prevChatArray.filter((chatObj) => chatObj.id !== id)
        );
    };
    const handleClearMessages = async () => {
        try {
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
            setAgentArray((prevChatArray) =>
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
                    <IconButton aria-label="close" onClick={handleCloseChat}>
                        <CloseIcon />
                    </IconButton>
                </ChatBarIcons>
            </ChatBar>
            <MessagesContainer item xs={9}>
                <MessageArea>
                    {messages.map((message, index) => {
                        if (message) {
                            if (message.message_from === 'chatbot') {
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
                    {streamingMessageParts.length > 0 && (
                        <AgentMessage
                            key={`agentMessage${id}`}
                            message={streamingMessageParts}
                        />
                    )}
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
