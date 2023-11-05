import { TextBlock, CodeBlock } from '../chat_container/AgentMessage';
import { highlightBlockCode } from './codeHighLighter';

// Function to process messages from the database
export const processDatabaseMessage = async (message) => {
    let parts = [];
    let i = 0;
    let processedMessage = await highlightBlockCode(message);
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

export const processStreamMessage = (prevMessage, token) => {
    const lastMessage = prevMessage[prevMessage.length - 1];
    if (lastMessage.message_from === 'user') {
        return [...prevMessage, token];
    } else {
        const newLastMessage = {
            ...lastMessage,
            message_content:
                lastMessage.message_content + token.message_content,
        };
        return [...prevMessage.slice(0, -1), newLastMessage];
    }
};
