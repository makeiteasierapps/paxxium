import { TextBlock, CodeBlock } from '../chat_container/AgentMessage'
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

// Function to process new messages from the stream
export const processStreamMessage = (
    newMessages,
    textRef,
    codeRef,
    setStream
) => {
    newMessages.forEach((message) => {
        if (message.type === 'text') {
            textRef.current += message.content;
            setStream((prev) => {
                const updatedParts = [...prev];
                const lastPart = updatedParts[updatedParts.length - 1];

                if (lastPart && lastPart.type === TextBlock) {
                    updatedParts[updatedParts.length - 1] = (
                        <TextBlock text={textRef.current} />
                    );
                } else {
                    updatedParts.push(<TextBlock text={textRef.current} />);
                }

                return updatedParts;
            });
        } else {
            textRef.current = '';
            codeRef.current += message.content;
            setStream((prev) => {
                const updatedParts = [...prev];
                const lastPart = updatedParts[updatedParts.length - 1];

                if (lastPart && lastPart.type === CodeBlock) {
                    updatedParts[updatedParts.length - 1] = (
                        <CodeBlock code={codeRef.current} />
                    );
                } else {
                    updatedParts.push(<CodeBlock code={codeRef.current} />);
                }

                return updatedParts;
            });
        }
    });
};
