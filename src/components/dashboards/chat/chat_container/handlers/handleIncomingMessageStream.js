// This function processes the stream of messages coming from the chat.
// It takes the previous message, the id of the current chat, and the token of the new message as parameters.
// it handles returning the new message state object
export const handleIncomingMessageStream = (
    prevMessage,
    id,
    tokenObj,
    setInsideCodeBlock
) => {
    const lastMessage = prevMessage[id][prevMessage[id].length - 1];
    const codeStartIndicator = /```/g;
    const codeEndIndicator = /``/g;

    // Check if the token starts or ends a code block
    if (
        codeStartIndicator.test(tokenObj.message_content) ||
        codeEndIndicator.test(tokenObj.message_content)
    ) {
        setInsideCodeBlock((prevInsideCodeBlock) => !prevInsideCodeBlock);
    }

    if (lastMessage.message_from === 'user') {
        return {
            ...prevMessage,
            [id]: [...prevMessage[id], tokenObj],
        };
    } else {
        const newLastMessage = {
            ...lastMessage,
            message_content:
                lastMessage.message_content + tokenObj.message_content,
        };
        return {
            ...prevMessage,
            [id]: [...prevMessage[id].slice(0, -1), newLastMessage],
        };
    }
};
