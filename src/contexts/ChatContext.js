import React, { useState, createContext } from 'react';

export const ChatContext = createContext();

export const ChatProvider = (props) => {
    const [uid, setUid] = useState(null);
    const [chatArray, setChatArray] = useState([]);
    const [chatId, setChatId] = useState(null);
    const [username, setUsername] = useState(null);
    const [messages, setMessages] = useState([]);

    const addChat = (newChat) => {
        setChatArray((prevChats) => [
            newChat,
            ...prevChats,
        ]);
        setChatId(newChat.id);
    };

    const switchConversation = (id) => {
        setChatId(id);
    };

    const deleteConversationId = (id) => {
        setChatArray((prevIds) =>
            prevIds.filter((prevId) => prevId !== id)
        );
    };

    return (
        <ChatContext.Provider
            value={{
                uid,
                setUid,
                chatArray,
                setChatArray,
                chatId,
                setChatId,
                addChat,
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
