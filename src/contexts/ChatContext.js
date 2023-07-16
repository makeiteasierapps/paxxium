import React, { useState, createContext } from 'react';

export const ChatContext = createContext();

export const ChatProvider = (props) => {
    const [userId, setUserId] = useState(null);
    const [selectedAgentId, setSelectedAgentId] = useState(null);
    const [selectedAgentName, setSelectedAgentName] = useState(null);
    const [conversationList, setConversationList] = useState([]);
    const [conversationId, setConversationId] = useState(null);
    const [username, setUsername] = useState(null);
    const [messages, setMessages] = useState([]);

    const addConversation = (newConversation) => {
        setConversationList((prevConversations) => [
            newConversation,
            ...prevConversations,
        ]);
        setConversationId(newConversation.id);
    };

    const switchConversation = (id) => {
        setConversationId(id);
    };

    const deleteConversationId = (id) => {
        setConversationList((prevIds) =>
            prevIds.filter((prevId) => prevId !== id)
        );
    };

    return (
        <ChatContext.Provider
            value={{
                userId,
                setUserId,
                selectedAgentId,
                setSelectedAgentId,
                selectedAgentName,
                setSelectedAgentName,
                conversationList,
                setConversationList,
                conversationId,
                setConversationId,
                addConversation,
                switchConversation,
                deleteConversationId,
                username,
                setUsername,
                messages,
                setMessages,
            }}
        >
            {props.children}
        </ChatContext.Provider>
    );
};
