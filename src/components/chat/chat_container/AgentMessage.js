import React, { memo, useEffect, useState, useRef } from 'react';
import { Avatar, ListItem, ListItemIcon, Checkbox } from '@mui/material';
import { styled } from '@mui/system';
import { Icon } from '@iconify/react';
import { blueGrey } from '@mui/material/colors';
import { highlightBlockCode } from '../../../utils/ProcessResponse';

const BotMessageStyled = styled(ListItem)({
    backgroundColor: blueGrey[700],
    wordBreak: 'break-word',
    alignItems: 'flex-start',
    flexDirection: 'column',
});

const MessageContent = styled('div')({
    maxHeight: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    width: '100%',
    whiteSpace: 'pre-wrap',
});

const StyledCheckbox = styled(Checkbox)({
    color: blueGrey[700],
    '&.Mui-checked': {
        color: '#1C282E',
    },
});

const StyledHeader = styled('div')({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
});

const TextBlock = React.memo(({ text }) => {
    return <p>{text}</p>;
});

const CodeBlock = React.memo(({ code }) => {
    return (
        <pre className="language-javascript">
            <code
                className="language-javascript"
                dangerouslySetInnerHTML={{ __html: code }}
            />
        </pre>
    );
});

const AgentMessage = ({ message }) => {
    const [checked, setChecked] = useState(false);
    const [messageParts, setMessageParts] = useState([]);
    const [stream, setStream] = useState([]);
    const textRef = useRef('');
    const codeRef = useRef('');
    const lastProcessedIndex = useRef(-1);

    const processDatabaseMessage = async (message) => {
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

    const processStreamMessage =  (message) => {
        const lastIndex = message.length - 1;
        if (lastIndex > lastProcessedIndex.current) {
            const lastMessage = message[lastIndex];

            if (lastMessage.type === 'text') {
                textRef.current += lastMessage.content;
                setStream((prev) => {
                    const updatedParts = [...prev];
                    const lastPart = updatedParts[updatedParts.length - 1];

                    if (lastPart && lastPart.type === TextBlock) {
                        updatedParts[updatedParts.length - 1] = (
                            <TextBlock text={textRef.current} />
                        );
                    } else {
                        updatedParts.push(
                            <TextBlock text={textRef.current} />
                        );
                    }

                    return updatedParts;
                });
            } else {
                textRef.current = '';
                codeRef.current += lastMessage.content;
                setStream((prev) => {
                    const updatedParts = [...prev];
                    const lastPart = updatedParts[updatedParts.length - 1];

                    if (lastPart && lastPart.type === CodeBlock) {
                        updatedParts[updatedParts.length - 1] = (
                            <CodeBlock code={codeRef.current} />
                        );
                    } else {

                        updatedParts.push(
                            <CodeBlock code={codeRef.current} />
                        );
                    }

                    return updatedParts;
                });
            }

            lastProcessedIndex.current = lastIndex;
        }
    };
    
    useEffect(() => {
        if (Array.isArray(message)) {
            processStreamMessage(message);
        } else if (typeof message === 'object') {
            processDatabaseMessage(message).then(setMessageParts);
        }
    }, [message]);

    const handleCheck = (event) => {
        setChecked(event.target.checked);
    };

    return (
        <BotMessageStyled>
            <StyledHeader>
                <ListItemIcon>
                    <Avatar
                        variant="square"
                        sx={{
                            bgcolor: 'secondary.main',
                            width: '30px',
                            height: '30px',
                        }}
                    >
                        <Icon icon="mdi:robot" style={{ fontSize: '33px' }} />
                    </Avatar>
                </ListItemIcon>
                <StyledCheckbox
                    checked={checked}
                    onChange={handleCheck}
                    inputProps={{ 'aris-label': 'Select message' }}
                />
            </StyledHeader>
            <MessageContent>
                {messageParts.map((part, index) => {
                    if (part.type === 'text') {
                        return (
                            <TextBlock
                                key={`text${index}`}
                                text={part.content}
                            />
                        );
                    } else if (part.type === 'code') {
                        return (
                            <CodeBlock
                                key={`code${index}`}
                                code={part.content}
                            />
                        );
                    }
                })}
                {stream}
            </MessageContent>
        </BotMessageStyled>
    );
};

export default memo(AgentMessage);
