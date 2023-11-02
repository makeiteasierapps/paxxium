// This whole component and logic needs to be refactored
// I think setting up socket.io would be a better solution
// With that I could remove shouldStartDebate and fetchMessages

import React, {
    useRef,
    useContext,
    useEffect,
    useState,
    useCallback,
} from 'react';

import { styled } from '@mui/system';
import { List, Box } from '@mui/material';
import ChatBar from '../chat_container/ChatBar';
import DebateMessage from './DebateMessage';
import { AuthContext } from '../../../../contexts/AuthContext';
import { ChatContext } from '../../../../contexts/ChatContext';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

// Syled components
const DebateContainerStyled = styled(Box)(({ theme }) => ({
    marginLeft: '20px',
    height: '800px',
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
    overflow: 'auto',
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

    return (
        <DebateContainerStyled>
            <ChatBar
                chatName={chatName}
                id={id}
                idToken={idToken}
                setAgentArray={setAgentArray}
                setMessages={setMessages}
                backendUrl={backendUrl}
            />
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
