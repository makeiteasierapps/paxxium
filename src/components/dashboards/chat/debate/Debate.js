import { useEffect, useState, useRef, useContext, useCallback } from 'react';
import io from 'socket.io-client';
import { styled } from '@mui/system';
import { List, Box } from '@mui/material';
import ChatBar from '../chat_container/ChatBar';
import DebateMessage from './DebateMessage';
import { AuthContext } from '../../../../contexts/AuthContext';
import { ChatContext } from '../../../../contexts/ChatContext';
import { processToken } from '../utils/processToken';
import { handleIncomingMessageStream } from '../chat_container/handlers/handleIncomingMessageStream';

// Syled components
const DebateContainerStyled = styled(Box)(({ theme }) => ({
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

const Debate = ({ id, chatName, topic }) => {
    const socketRef = useRef(null);
    const [queue, setQueue] = useState([]);
    const ignoreNextTokenRef = useRef(false);
    const languageRef = useRef('markdown');
    const [debateMessages, setDebateMessages] = useState({});

    const { insideCodeBlock, setInsideCodeBlock } = useContext(ChatContext);

    const { uid, idToken } = useContext(AuthContext);

    const fetchMessages = useCallback(async () => {
        try {
            const requestData = {
                agentModel: 'AgentDebate',
            };
            const response = await fetch(`${backendUrl}/${id}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: idToken,
                },
                credentials: 'include',
                body: JSON.stringify(requestData),
            });
            if (!response.ok) throw new Error('Failed to fetch messages');
            const data = await response.json();
            const newMessages = { [id]: data.messages };
            return newMessages;
        } catch (error) {
            console.error(error);
            return [];
        }
    }, [id, idToken]);

    // Initialize/Close socket connection
    useEffect(() => {
        socketRef.current = io.connect(backendUrl);

        return () => socketRef.current.close();
    }, []);

    // Runs when component mounts to either fetch messages or start the debate
    useEffect(() => {
        // Start the debate when the component mounts
        const startDebate = async (turn = 0) => {
            if (!socketRef.current) return;

            // Try to fetch messages first
            const messages = await fetchMessages();
            if (messages[id].length > 0) {
                setDebateMessages(messages);
                return;
            }

            // Join the room named after the debate's id
            socketRef.current.emit('join', { room: id });

            // Send 'start_debate' event to the server
            socketRef.current.emit('start_debate', {
                uid_debate_id_tuple: [uid, id],
                topic: topic,
                turn: turn,
            });
        };
        startDebate();
    }, [fetchMessages, id, setDebateMessages, topic, uid]);

    // Manages the debate after it starts
    useEffect(() => {
        if (!socketRef.current) return;

        socketRef.current.on('debate_started', (data) => {
            setDebateMessages((prevMessages) => {
                return {
                    ...prevMessages,
                    [id]: [
                        ...prevMessages[id].slice(
                            0,
                            prevMessages[id].length - 1
                        ),
                        data.message,
                    ],
                };
            });

            // Continue the debate if there are more turns
            if (data.hasMoreTurns) {
                socketRef.current.emit('start_debate', {
                    uid_debate_id_tuple: [uid, id],
                    topic: topic,
                    turn: debateMessages[id].length, // The turn is the current number of messages
                });
            }
        });

        return () => socketRef.current.off('debate_started');
    }, [
        uid,
        id,
        topic,
        setDebateMessages,
        debateMessages.length,
        debateMessages,
    ]);

    useEffect(() => {
        const handleToken = (token) => {
            setQueue((prevQueue) => [...prevQueue, token]);
        };

        socketRef.current = io.connect(backendUrl);
        socketRef.current.emit('join', { room: id });
        socketRef.current.on('token', handleToken);
    }, [id]);

    useEffect(() => {
        if (queue.length > 0) {
            processToken(
                queue[0],
                setInsideCodeBlock,
                insideCodeBlock,
                setDebateMessages,
                handleIncomingMessageStream,
                id,
                ignoreNextTokenRef,
                languageRef
            );
            setQueue((prevQueue) => prevQueue.slice(1));
        }
    }, [queue, setInsideCodeBlock, insideCodeBlock, id, setDebateMessages]);

    return (
        <DebateContainerStyled>
            <ChatBar chatName={chatName} id={id} />
            <MessagesContainer item xs={9}>
                <MessageArea>
                    {debateMessages[id]?.map((messageObj, index) => {
                        // Check if messageObj is an array, if not convert it into an array
                        const messages = Array.isArray(messageObj)
                            ? messageObj
                            : [messageObj];
                        return messages.map((message, subIndex) => {
                            if (message) {
                                if (message.message_from === 'agent1') {
                                    return (
                                        <DebateMessage
                                            key={`${index}-${subIndex}`}
                                            message={message.content}
                                            agent="agent1"
                                        />
                                    );
                                } else if (message.message_from === 'agent2') {
                                    return (
                                        <DebateMessage
                                            key={`${index}-${subIndex}`}
                                            message={message.content}
                                            agent="agent2"
                                        />
                                    );
                                }
                            }
                            return null; // return null when the message doesn't exist
                        });
                    })}
                </MessageArea>
            </MessagesContainer>
        </DebateContainerStyled>
    );
};

export default Debate;
