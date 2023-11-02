export const handleCloseChat = async (
    id,
    idToken,
    setAgentArray,
    backendUrl
) => {
    try {
        const response = await fetch(`${backendUrl}/chat/update_visibility`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: idToken,
            },
            body: JSON.stringify({ id: id, is_open: false }),
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to update chat');
        setAgentArray((prevChatArray) =>
            prevChatArray.filter((chatObj) => chatObj.id !== id)
        );
    } catch (error) {
        console.log(error);
    }
};

export const handleClearMessages = async (
    id,
    idToken,
    setMessages,
    backendUrl
) => {
    try {
        const response = await fetch(`${backendUrl}/${id}/messages/clear`, {
            method: 'DELETE',
            headers: { Authorization: idToken },
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to clear messages');
        setMessages([]);
    } catch (error) {
        console.error(error);
    }
};

export const handleDeleteChat = async (
    id,
    idToken,
    setAgentArray,
    backendUrl
) => {
    try {
        const response = await fetch(`${backendUrl}/chat/${id}/delete`, {
            method: 'DELETE',
            headers: { Authorization: idToken },
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to delete conversation');
        setAgentArray((prevChatArray) =>
            prevChatArray.filter((chatObj) => chatObj.id !== id)
        );
    } catch (error) {
        console.error(error);
    }
};
