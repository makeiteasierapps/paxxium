import React, { useState, createContext } from 'react';

export const ChatContext = createContext();

export const ChatProvider = (props) => {
    const [uid, setUid] = useState(null);
    const [agentArray, setAgentArray] = useState([]);
    const [agentId, setAgentId] = useState(null);
    const [username, setUsername] = useState(null);
    const [messages, setMessages] = useState([]);

    const addAgent = (newAgent) => {
        setAgentArray((prevAgents) => [
            newAgent,
            ...prevAgents,
        ]);
        setAgentId(newAgent.id);
    };

    const switchConversation = (id) => {
        setAgentId(id);
    };


    return (
        <ChatContext.Provider
            value={{
                uid,
                setUid,
                agentArray,
                setAgentArray,
                agentId,
                setAgentId,
                addAgent,
                switchConversation,
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
