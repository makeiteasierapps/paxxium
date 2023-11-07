import { TextBlock, CodeBlock } from '../chat_container/AgentMessage';
import { highlightDatabaseCode, highlightStreamCode } from './codeHighLighter';

// Function to process messages from the database
export const processDatabaseMessage = async (message) => {
    let parts = [];
    let i = 0;
    let processedMessage = await highlightDatabaseCode(message);
    let message_content = processedMessage.message_content;

    while (message_content.includes('CODEBLOCK' + i)) {
        let splitMessage = message_content.split('CODEBLOCK' + i);
        parts.push({ type: 'text', content: splitMessage[0] });

        if (
            processedMessage.codeBlocks &&
            processedMessage.codeBlocks['CODEBLOCK' + i]
        ) {
            parts.push({
                type: 'code',
                content: processedMessage.codeBlocks['CODEBLOCK' + i],
            });
        }

        message_content = splitMessage[1] ? splitMessage[1] : '';
        i++;
    }

    if (message_content) {
        parts.push({ type: 'text', content: message_content });
    }

    return parts;
};

// This function processes the stream of messages coming from the chat.
// It takes the previous message, the id of the current chat, and the token of the new message as parameters.
export const processStreamMessage = (
    prevMessage,
    id,
    token,
    isCodeBlock,
    setIsCodeBlock,
    setCodeBlock,
    codeBlock
) => {
    const lastMessage = prevMessage[id][prevMessage[id].length - 1];
    console.log(token);
    // Check if the token is a start or end of a code block
    if (
        token.message_content.trim() === '' ||
        token.message_content.trim() === ''
    ) {
        // Toggle the isCodeBlock state
        setIsCodeBlock((prevIsCodeBlock) => {
            const newIsCodeBlock = !prevIsCodeBlock;
            if (!newIsCodeBlock) {
                // Code block has ended, process the code block here
                const processedCodeBlock = highlightStreamCode(
                    codeBlock,
                    'javascript'
                );
                setCodeBlock(processedCodeBlock);
            }
            return newIsCodeBlock;
        });
        return {
            ...prevMessage,
            [id]: [
                ...prevMessage[id].slice(0, -1),
                {
                    message_content: codeBlock,
                    message_from: 'agent',
                    type: 'stream',
                    chat_id: id,
                },
            ],
        };
    } else {
        // If not inside a code block, handle as before
        if (lastMessage.message_from === 'user') {
            return {
                ...prevMessage,
                [id]: [...prevMessage[id], token],
            };
        } else {
            const newLastMessage = {
                ...lastMessage,
                message_content:
                    lastMessage.message_content + token.message_content,
            };
            return {
                ...prevMessage,
                [id]: [...prevMessage[id].slice(0, -1), newLastMessage],
            };
        }
    }
};
