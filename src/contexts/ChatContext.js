import React, { useState, createContext } from 'react';

export const ChatContext = createContext();

export const ChatProvider = (props) => {
    const [uid, setUid] = useState(null);
    const [selectedAgentId, setSelectedAgentId] = useState(null);
    const [selectedAgentName, setSelectedAgentName] = useState(null);
    const [conversationList, setConversationList] = useState([]);
    const [conversationId, setConversationId] = useState(null);
    const [username, setUsername] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isCodeBlock, setIsCodeBlock] = useState(false);

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
                uid,
                setUid,
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
                isCodeBlock,
                setIsCodeBlock,
            }}
        >
            {props.children}
        </ChatContext.Provider>
    );
};
