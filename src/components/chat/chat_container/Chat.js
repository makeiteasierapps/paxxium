import React, {
    useRef,
    useContext,
    useEffect,
    useState,
    useCallback,
} from 'react';

import { styled } from '@mui/system';
import { List, Box, Typography, IconButton } from '@mui/material';

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
    marginLeft: '20px',
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
    const { setAgentArray } = useContext(ChatContext);
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

    const processToken = useCallback(
        async (token) => {
            // Check if the token marks the start or end of a code block.
            if (token.startsWith('```') || token.startsWith('``')) {
                if (isCodeBlockRef.current) {
                    // End of a code block, reset variables for the next code block.
                    const highlightedCode = await highlightStringCode(
                        codeRef.current,
                        langRef.current
                    );

                    tokenizedCodeRef.current = highlightedCode
                        .split(/(<[^>]*>)|\b/)
                        .filter(Boolean);
                    setMessages((prevMessages) => {
                        const updatedMessages = [...prevMessages];
                        // Loop through each element of tokenizedCode and add it to the last element of updatedMessages
                        for (
                            let i = 0;
                            i < tokenizedCodeRef.current.length;
                            i++
                        ) {
                            updatedMessages.push(tokenizedCodeRef.current[i]);
                        }
                        return updatedMessages;
                    });
                    tokenizedCodeRef.current = [];
                    isCodeBlockRef.current = false;
                    langRef.current = 'markdown';
                    codeRef.current = ''; // Clear the tokenizedCode array
                } else {
                    // Start of a code block.
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
            }

            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages];
                const lastMessage = updatedMessages[updatedMessages.length - 1];
                if (!isCodeBlockRef.current) {
                    if (typeof lastMessage === 'object') {
                        updatedMessages.push(token);
                    }
                    else if (typeof lastMessage === 'string') {
                        updatedMessages[updatedMessages.length - 1] += token;
                    }
                } else if (token === '```') {
                    updatedMessages.push(token);
                }

                return updatedMessages;
            });
        },
        [setMessages] // Dependencies of the processQueue function.
    );

    // Set up an effect to listen to incoming tokens and process.
    useEffect(() => {
        const handleToken = (token) => {
            processToken(token);
        };

        // Register the event listener for incoming tokens.
        socketRef.current.on('token', handleToken);

        // Clean up by removing the event listener when the component is unmounted.
        return () => {
            socketRef.current.off('token', handleToken);
        };
    }, [processToken]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(scrollToBottom, [messages]);

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
                </ChatBarIcons>
            </ChatBar>
            <MessagesContainer item xs={9}>
                <MessageArea>
                    {messages.map((message, index) => {
                        if (message) {
                            if (typeof message === 'string') {
                                // This is a streaming message
                                return (
                                    <AgentMessage
                                        key={index}
                                        message={message}
                                    />
                                );
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
