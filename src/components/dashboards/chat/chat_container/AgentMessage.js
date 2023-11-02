import React, { memo, useEffect, useState, useRef } from 'react';
import { Avatar, ListItem, ListItemIcon, Checkbox } from '@mui/material';
import { styled } from '@mui/system';
import { Icon } from '@iconify/react';
import { blueGrey } from '@mui/material/colors';

import {
    processDatabaseMessage,
    processStreamMessage,
} from '../utils/messageUtils';

const BotMessageStyled = styled(ListItem)({
    backgroundColor: blueGrey[700],
    wordBreak: 'break-word',
    alignItems: 'flex-start',
    flexDirection: 'column',
});

const MessageContent = styled('div')({
    maxHeight: '100%',
    padding: '0px 31px',
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

export const TextBlock = React.memo(({ text }) => {
    return <p>{text}</p>;
});

export const CodeBlock = React.memo(({ code }) => {
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
    // State for checkbox and processed messages
    const [checked, setChecked] = useState(false);
    const [messageParts, setMessageParts] = useState([]);
    const [stream, setStream] = useState([]);

    // Refs for accumulating text and code content
    const textRef = useRef('');
    const codeRef = useRef('');

    // Effect hook to process messages when they arrive
    useEffect(() => {
        // If message is an array, it's a stream of new messages
        if (Array.isArray(message)) {
            // Slice the message array to get only the new messages
            // This works because stream.length is the number of messages already processed
            processStreamMessage(message, textRef, codeRef, setStream);
        }
        // If message is an object, it's a single message from the database
        else if (typeof message === 'object') {
            processDatabaseMessage(message).then(setMessageParts);
        }
    }, [message]);

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
                    onChange={(event) => setChecked(event.target.checked)}
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
