import React, { useState, createContext } from 'react';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [agentArray, setAgentArray] = useState([]);
    const [agentId, setAgentId] = useState(null);
    const [messages, setMessages] = useState([]);

    const addAgent = (newAgent) => {
        setAgentArray((prevAgents) => [newAgent, ...prevAgents]);
        setAgentId(newAgent.id);
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
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
