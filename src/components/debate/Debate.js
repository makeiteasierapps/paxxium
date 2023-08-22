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

import MessagesContainer from '../chat/chat_container/MessagesContainer';
import DebateMessage from './DebateMessage';

import { AuthContext } from '../../contexts/AuthContext';
import { ChatContext } from '../../contexts/ChatContext';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

// STYLED COMPONENTS
const DebateContainerStyled = styled(Box)(({ theme }) => ({
    marginLeft: '20px',
    height: '800px',
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
    overflow: 'auto',
}));

const DebateBar = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderBottom: '1px solid #e0e0e0',
}));

const DebateBarIcons = styled(Box)(({ theme }) => ({
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

const Debate = ({ id, chatName, topic }) => {
    const messagesEndRef = useRef(null);
    const { setAgentArray } = useContext(ChatContext);
    const { idToken } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [shouldStartDebate, setShouldStartDebate] = useState(false);

    const startDebate = useCallback(
        async (turn = 0) => {
            try {
                const response = await fetch(
                    `${backendUrl}/debate/start_debate`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: idToken,
                        },
                        body: JSON.stringify({
                            turn: turn,
                            topic: topic,
                        }),
                    }
                );
                const data = await response.json();
                setMessages((prevMessages) => [...prevMessages, data.message]);

                if (data.hasMoreTurns) {
                    startDebate(turn + 1);
                }
            } catch (error) {
                console.error('Failed to start debate:', error);
            }
        },
        [idToken, topic]
    );

    const fetchMessages = useCallback(async () => {
        if (!shouldStartDebate) return;
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

            if (data.messages && data.messages.length > 0) {
                setMessages(data.messages);
            } else {
                console.log('No messages found, starting debate');
                startDebate();
            }
        } catch (error) {
            console.error(error);
        }
    }, [id, idToken, shouldStartDebate, startDebate]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShouldStartDebate(true);
        }, 1000); 

        return () => clearTimeout(timer); 
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages, id]);

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
        <DebateContainerStyled>
            <DebateBar>
                <Typography variant="h6">{chatName}</Typography>
                <DebateBarIcons>
                    <IconButton
                        aria-label="clear_chat"
                        onClick={handleClearMessages}
                    >
                        <CommentsDisabledIcon />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={handleDeleteChat}>
                        <DeleteIcon />
                    </IconButton>
                </DebateBarIcons>
            </DebateBar>
            <MessagesContainer item xs={9}>
                <MessageArea>
                    {messages.map((message, index) => {
                        if (message) {
                            if (message.message_from === 'agent1') {
                                return (
                                    <DebateMessage
                                        key={index}
                                        message={message}
                                        agent="agent1"
                                    />
                                );
                            } else if (message.message_from === 'agent2') {
                                return (
                                    <DebateMessage
                                        key={index}
                                        message={message}
                                        agent="agent2"
                                    />
                                );
                            }
                        }
                        return null; // return null when the message doesn't exist
                    })}
                    <div ref={messagesEndRef} />
                </MessageArea>
            </MessagesContainer>
        </DebateContainerStyled>
    );
};

export default Debate;
