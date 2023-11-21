import React, { useState, createContext } from 'react';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [agentArray, setAgentArray] = useState([]);
    const [agentId, setAgentId] = useState(null);
    const [messages, setMessages] = useState({});
    const [insideCodeBlock, setInsideCodeBlock] = useState(false);

    const addAgent = (newAgent) => {
        setAgentArray((prevAgents) => [newAgent, ...prevAgents]);
        setAgentId(newAgent.id);
        setMessages((prevMessages) => ({
            ...prevMessages,
            [newAgent.id]: [],
        }));
    };

    // Used to add a new user message to the messages state
    const addMessage = (agentId, newMessage) => {
        setMessages((prevMessageParts) => ({
            ...prevMessageParts,
            [agentId]: [...prevMessageParts[agentId], newMessage],
        }));
    };

    const switchConversation = (id) => {
        setAgentId(id);
    };

    return (
        <ChatContext.Provider
            value={{
                agentArray,
                setAgentArray,
                agentId,
                setAgentId,
                addAgent,
                switchConversation,
                messages,
                setMessages,
                addMessage,
                insideCodeBlock,
                setInsideCodeBlock,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
