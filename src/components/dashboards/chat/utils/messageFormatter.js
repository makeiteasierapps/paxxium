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

// This function processes a message from the database, highlighting any code blocks within it.
export const formatDatabaseMessage = async (message, insideCodeBlock) => {
    // Initialize an array to hold the parts of the processed message.
    let parts = [];

    // Initialize a counter for the code blocks.
    let i = 0;

    // Call the highlightBlockCode function to process the message and highlight any code blocks.
    let processedMessage = await formatStreamMessage(message, insideCodeBlock);

    // Extract the content of the processed message.
    let message_content = processedMessage.message_content;

    // Loop through the message content, splitting it at each code block.
    while (message_content.includes('CODEBLOCK' + i)) {
        // Split the message content at the current code block.
        let splitMessage = message_content.split('CODEBLOCK' + i);

        // Add the text before the code block to the parts array.
        parts.push({ type: 'text', content: splitMessage[0] });

        // If the processed message contains the current code block, add it to the parts array.
        if (
            processedMessage.codeBlocks &&
            processedMessage.codeBlocks['CODEBLOCK' + i]
        ) {
            parts.push({
                type: 'code',
                content: processedMessage.codeBlocks['CODEBLOCK' + i].code,
                language: processedMessage.codeBlocks['CODEBLOCK' + i].language,
            });
        }

        // Update the message content to be the text after the current code block.
        message_content = splitMessage[1] ? splitMessage[1] : '';

        // Increment the code block counter.
        i++;
    }

    // If the message contains code that isn't in a code block, add it to the parts array.
    if (message.code && !message_content.includes('CODEBLOCK')) {
        parts.push({ type: 'text', content: message_content });
        parts.push({
            type: 'code',
            content: message.code,
            language: 'bash',
        });
    }
    // If there's any remaining message content, add it to the parts array.
    else if (message_content) {
        parts.push({ type: 'text', content: message_content });
    }

    // Return the parts array, which now contains the processed message.
    return parts;
};

const highlightBlockCode = async (message) => {
    // Processes each code block in the message
    // Initialize codeBlocks object and codeBlockCount
    const codeblock = /```(\S*)?\s([\s\S]*?)```/g;
    message.codeBlocks = message.codeBlocks || {};
    let match;
    message.codeBlockCount = message.codeBlockCount || 0;
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

        // Store the highlighted code block in the message.codeBlocks object
        const codeBlockKey = 'CODEBLOCK' + message.codeBlockCount;
        message.codeBlocks[codeBlockKey] = {
            language: lang,
            code: highlightedCode,
        };

        // Replace the original code block with the placeholder in the message content
        message.message_content = message.message_content.replace(
            match[0],
            codeBlockKey
        );

        message.codeBlockCount++;
    }

    return message;
};

export const formatStreamMessage = (
    message,
    insideCodeBlock,
    setProcessedMessages
) => {
    const splitMessage = message.message_content.split('```');
    for (let i = 0; i < splitMessage.length; i++) {
        if (insideCodeBlock) {
            // code block
            setProcessedMessages((prevMsgs) => {
                if (
                    prevMsgs.length > 0 &&
                    prevMsgs[prevMsgs.length - 1].type === 'text'
                ) {
                    return [
                        ...prevMsgs,
                        {
                            type: 'code',
                            content: splitMessage[i],
                            language: 'bash',
                        },
                    ];
                } else {
                    let newMsgs = [...prevMsgs];
                    newMsgs[newMsgs.length - 1] = {
                        type: 'code',
                        content: splitMessage[i],
                        language: 'bash',
                    };
                    return newMsgs;
                }
            });
        } else {
            // text block
            setProcessedMessages((prevMsgs) => {
                if (
                    prevMsgs.length === 0 ||
                    prevMsgs[prevMsgs.length - 1].type === 'code'
                ) {
                    return [
                        ...prevMsgs,
                        { type: 'text', content: splitMessage[i] },
                    ];
                } else {
                    let newMsgs = [...prevMsgs];
                    newMsgs[newMsgs.length - 1] = {
                        type: 'text',
                        content: splitMessage[i],
                    };
                    return newMsgs;
                }
            });
        }
    }

    return message;
};
