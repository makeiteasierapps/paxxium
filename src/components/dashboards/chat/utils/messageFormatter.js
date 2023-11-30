import Prism from 'prismjs';
import 'prismjs/components/prism-javascript.min';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-typescript';
import 'prismjs/themes/prism-okaidia.css';

export const formatBlockMessage = (message) => {
    const codeblock = /```(\S*)?\s([\s\S]*?)```/g;
    let parts = [];
    let match;
    let lastIndex = 0;

    while ((match = codeblock.exec(message.message_content)) !== null) {
        let lang = match[1] || 'markdown'; // set to markdown if no language is specified
        const code = match[2].trim();

        if (lang === 'jsx') {
            lang = 'javascript';
        }

        const highlightedCode = Prism.highlight(
            code,
            Prism.languages[lang] || Prism.languages.plaintext,
            lang
        );

        // Add the text before the code block to the parts array.
        if (match.index > lastIndex) {
            parts.push({
                type: 'text',
                content: message.message_content.substring(
                    lastIndex,
                    match.index
                ),
            });
        }

        // Add the highlighted code block to the parts array.
        parts.push({
            type: 'code',
            content: highlightedCode,
            language: lang,
        });

        lastIndex = codeblock.lastIndex;
    }

    // If there's any remaining message content, add it to the parts array.
    if (lastIndex < message.message_content.length) {
        parts.push({
            type: 'text',
            content: message.message_content.substring(lastIndex),
        });
    }

    return parts;
};

export const formatStreamMessage = (
    message,
    insideCodeBlock,
    setProcessedMessages,
) => {
    if (message.message_content === '``') {
        return message;
    }

    if (insideCodeBlock && message.message_content === '```') {
        return message;
    }

    // if (
    //     messages.VvYxaU9z4xLeiWHce8ps[messages.VvYxaU9z4xLeiWHce8ps.length - 1]
    //         .message_from === 'user'
    // ) {
    //     console.log('user');
    //     setProcessedMessages([]);
    // }

    // The message content is split into an array of strings, using '```' as the delimiter.
    // This is done to separate code blocks from the rest of the message.
    const splitMessage = message.message_content.split('```');
    console.log(splitMessage);

    // This function is used to update the state of processed messages.
    // It takes three arguments: `type` (the type of the message, e.g., 'code' or 'text'),
    // `content` (the content of the message), and `language` (the programming language of the code block, if applicable).
    const setMessages = (type, content, language) => {
        setProcessedMessages((prevMsgs) => {
            // If the array of previous messages is empty, or the type of the last message is different from the current one,
            // a new message object is appended to the array.
            if (
                prevMsgs.length === 0 ||
                prevMsgs[prevMsgs.length - 1].type !== type
            ) {
                return [...prevMsgs, { type, content, language }];
            } else {
                // If the type of the last message is the same as the current one, the last message object is replaced with the current one.
                let newMsgs = [...prevMsgs];
                newMsgs[newMsgs.length - 1] = { type, content, language };
                return newMsgs;
            }
        });
    };

    // The function iterates over the array of split messages.
    // If the `insideCodeBlock` flag is true, the message is treated as a code block and processed accordingly.
    // Otherwise, the message is treated as plain text.
    for (let i = 0; i < splitMessage.length; i++) {
        if (insideCodeBlock) {
            setMessages('code', splitMessage[i], 'bash');
        } else {
            setMessages('text', splitMessage[i]);
        }
    }

    // The original message is returned.
    return message;
};
