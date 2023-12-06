export const processToken = (
    token,
    setInsideCodeBlock,
    insideCodeBlock,
    setMessages,
    handleIncomingMessageStream,
    id,
    ignoreNextTokenRef,
    languageRef
) => {
    const codeStartIndicator = /```/g;
    const codeEndIndicator = /``/g;

    let messageContent = token.message_content;
    if (ignoreNextTokenRef.current) {
        if (token.message_content.trim() !== '`') {
            // This means the token is not a backtick, so it should be the language
            languageRef.current = token.message_content.trim();
        }

        // Reset the flag after processing the token, regardless of its content
        ignoreNextTokenRef.current = false;
        return;
    }

    // Check if we are not ignoring this token and if there is a language set
    // This is the next tokenObj after we captured the language.
    if (!ignoreNextTokenRef.current && languageRef.current) {
        // Add the language property to the token object
        token.language = languageRef.current;
        //Removes a new line character
        token.message_content = ' ';
        // Reset languageRef as it has been used for this code block
        languageRef.current = null;
    }

    if (ignoreNextTokenRef.current) {
        ignoreNextTokenRef.current = false;

        return;
    }

    if (codeStartIndicator.test(messageContent)) {
        setInsideCodeBlock((prevInsideCodeBlock) => !prevInsideCodeBlock);

        ignoreNextTokenRef.current = true;

        return;
    }

    if (codeEndIndicator.test(messageContent)) {
        setInsideCodeBlock((prevInsideCodeBlock) => !prevInsideCodeBlock);

        ignoreNextTokenRef.current = true;

        return;
    }

    // If we reach here, it means the token is not a code start or end indicator
    // So, we can add it to the messages
    setMessages((prevMessage) => {
        const newMessageParts = handleIncomingMessageStream(
            prevMessage,
            id,
            token,
            insideCodeBlock
        );
        return newMessageParts;
    });
};
