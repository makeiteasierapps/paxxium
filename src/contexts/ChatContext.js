import React, { useState, createContext } from 'react';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [agentArray, setAgentArray] = useState([]);
    const [selectedAgentId, setSelectedAgentId] = useState(null);
    const [messages, setMessages] = useState({});
    const [insideCodeBlock, setInsideCodeBlock] = useState(false);

    const addAgent = (newAgent) => {
        setAgentArray((prevAgents) => [newAgent, ...prevAgents]);
        setSelectedAgentId(newAgent.id);
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


    return (
        <ChatContext.Provider
            value={{
                agentArray,
                setAgentArray,
                selectedAgentId,
                setSelectedAgentId,
                addAgent,
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
