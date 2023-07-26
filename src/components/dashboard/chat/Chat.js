import React, {
    useState,
    useEffect,
    useContext,
    useCallback,
    useRef,
} from 'react';
import { ChatContext } from '../../../contexts/ChatContext';
import { useDrawer } from '../../../contexts/DrawerContext';
import { AuthContext } from '../../../contexts/AuthContext';
import { styled } from '@mui/system';
import { List } from '@mui/material';
import MessageInput from './MessageInput';
import ChatSection from './ChatSection';
import MessagesContainer from './MessagesContainer';
import AgentMessage from './AgentMessage';
import UserMessage from './UserMessage';


const MessageArea = styled(List)({
    flexGrow: 1,
    overflowY: 'auto',
    width: '100%',
});

// This is the component for "Start A New Conversation"
const StartNewConversation = () => (
    <div
        style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
        }}
    >
        Start A New Conversation
    </div>
);

const Chat = React.memo(() => {
    const { open } = useDrawer();
    const {
        conversationId,
        setConversationId,
        setConversationList,
        messages,
        setMessages,
        setSelectedAgentId,
        setSelectedAgentName,
    } = useContext(ChatContext);

    const [error, setError] = useState(null);

    const { idToken } = useContext(AuthContext);

    const messagesEndRef = useRef(null);

    // This function fetches the conversations and messages
    const fetchConversationsAndMessages = useCallback(async () => {
        try {
            const response = await fetch(
                'http://localhost:5000/get_user_conversations',
                {
                    method: 'GET',
                    headers: {
                        Authorization: idToken,
                    },
                    credentials: 'include',
                }
            );

            if (!response.ok)
                throw new Error('Failed to load user conversations');

            const data = await response.json();
            setConversationList(data);

            if (data && data.length > 0) {
                const conversationId = data[0].id;
                setConversationId(conversationId);
            } else {
                setConversationId(null);
                setMessages([]);
            }
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    }, [
        idToken,
        setConversationId,
        setConversationList,
        setMessages,
    ]);

    // This effect runs when conversationId changes
    const fetchMessages = useCallback(
        async (conversationId) => {
            try {
                const url = `http://localhost:5000/${conversationId}/messages`;
                const messageResponse = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: idToken,
                    },
                    credentials: 'include',
                });
                if (!messageResponse.ok)
                    throw new Error('Failed to load messages');

                const messageData = await messageResponse.json();

                if (messageData && messageData.messages.length > 0) {
                    setMessages(messageData.messages);
                    setSelectedAgentId(messageData.messages[0].chatbot_id);
                    setSelectedAgentName(messageData.bot_name)   
                } else {
                    setMessages([]);
                }
            } catch (error) {
                console.error(error);
                setError(error.message);
            }
        },
        [idToken, setMessages, setSelectedAgentId, setSelectedAgentName] 
    );

    useEffect(() => {
        fetchConversationsAndMessages();
    }, [fetchConversationsAndMessages]);

    useEffect(() => {
        if (conversationId) {
            fetchMessages(conversationId);
        }
    }, [conversationId, fetchMessages]);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <ChatSection open={open}>
            <MessagesContainer item xs={9}>
                <MessageArea>
                    {messages.length === 0 && <StartNewConversation />}
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
                        return null; // return null when message doesn't exist
                    })}
                    <div ref={messagesEndRef} />
                </MessageArea>
                <MessageInput />
            </MessagesContainer>
        </ChatSection>
    );
});

export default Chat;
