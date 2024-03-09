export const handleCloseChat = async (
    id,
    idToken,
    setAgentArray,
) => {
    try {
        const backendUrl =
        process.env.NODE_ENV === 'development'
            ? process.env.REACT_APP_CHAT_URL
            : process.env.REACT_APP_BACKEND_URL_PROD;
        const response = await fetch(`${backendUrl}/chat/update_visibility`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: idToken,
            },
            body: JSON.stringify({ id: id, is_open: false }),
        });
        if (!response.ok) throw new Error('Failed to update chat');
        // Update the local state only after the database has been updated successfully
        setAgentArray((prevChatArray) =>
            prevChatArray.map((chatObj) =>
                chatObj.id === id ? { ...chatObj, is_open: false } : chatObj
            )
        );
    } catch (error) {
        console.log(error);
    }
};

export const handleClearMessages = async (
    id,
    idToken,
    setMessages,
) => {
    try {
        const backendUrl =
        process.env.NODE_ENV === 'development'
            ? process.env.REACT_APP_MESSAGES_URL
            : process.env.REACT_APP_BACKEND_URL_PROD;
        const response = await fetch(`${backendUrl}/messages/clear`, {
            method: 'DELETE',
            headers: {
                Authorization: idToken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }),
        });
        if (!response.ok) throw new Error('Failed to clear messages');
        setMessages((prevMessageParts) => ({
            ...prevMessageParts,
            [id]: [],
        }));
    } catch (error) {
        console.error(error);
    }
};

export const handleDeleteChat = async (
    id,
    idToken,
    setAgentArray,
) => {
    try {
        const backendUrl =
        process.env.NODE_ENV === 'development'
            ? process.env.REACT_APP_CHAT_URL
            : process.env.REACT_APP_BACKEND_URL_PROD;
        const response = await fetch(`${backendUrl}/chat/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: idToken,
            },
            body: JSON.stringify({ id: id }),
        });
        if (!response.ok) throw new Error('Failed to delete conversation');
        setAgentArray((prevChatArray) =>
            prevChatArray.filter((chatObj) => chatObj.id !== id)
        );
    } catch (error) {
        console.error(error);
    }
};
