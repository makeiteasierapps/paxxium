export const processIncomingStream = (prevMessage, id, tokenObj) => {
    // Ignore empty message_content
    if (tokenObj.content === '') {
        return prevMessage;
    }

    // If the message array for the chatId does not exist, create it
    if (!prevMessage[id]) {
        prevMessage[id] = [];
    }
    // If the message array for the chatId is empty or the last message is from the user, add the tokenObj to the message array
    if (
        prevMessage[id].length === 0 ||
        prevMessage[id][prevMessage[id].length - 1].message_from === 'user'
    ) {
        return {
            ...prevMessage,
            [id]: [
                ...prevMessage[id],
                {
                    message_from: 'agent',
                    content: [tokenObj],
                },
            ],
        };
    } else {
        const newPrevMessage = { ...prevMessage };
        const lastMessageIndex = newPrevMessage[id].length - 1;
        let lastMessageObject = newPrevMessage[id][lastMessageIndex];

        // Check if the last message object has the same type as the incoming token
        if (
            lastMessageObject.content[lastMessageObject.content.length - 1]
                .type === tokenObj.type
        ) {
            lastMessageObject.content[
                lastMessageObject.content.length - 1
            ].content += tokenObj.content;
        } else {
            lastMessageObject.content.push(tokenObj);
        }

        // Return the updated messages array without spreading it into a new array
        return newPrevMessage;
    }
};
