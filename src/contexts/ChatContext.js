import React, { useState, createContext } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [agentArray, setAgentArray] = useState([]);
  const [agentId, setAgentId] = useState(null);
  const [messageParts, setMessageParts] = useState([]);

  const addAgent = (newAgent) => {
    setAgentArray((prevAgents) => [newAgent, ...prevAgents]);
    setAgentId(newAgent.id);
    setMessageParts((prevMessageParts) => ({
      ...prevMessageParts,
      [newAgent.id]: [],
    }));
  };

  const addMessage = (agentId, newMessage) => {
    setMessageParts((prevMessageParts) => ({
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
        messageParts,
        setMessageParts,
        addMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
