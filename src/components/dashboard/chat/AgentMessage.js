import React, { memo, useReducer } from 'react';
import { Avatar, ListItem, ListItemIcon, Checkbox } from '@mui/material';
import { styled } from '@mui/system';
import { Icon } from '@iconify/react';
import { blueGrey } from '@mui/material/colors';
import { highlightBlockCode } from '../../../utils/ProcessResponse';
import { useEffect, useCallback } from 'react';

const BotMessageStyled = styled(ListItem)({
    backgroundColor: blueGrey[700],
    wordBreak: 'break-word',
    alignItems: 'flex-start',
});

const MessageContent = styled('div')({
    wordBreak: 'break-word',
});

const StyledCheckbox = styled(Checkbox)({
    color: blueGrey[700], // Specify your styles here
    '&.Mui-checked': {
        color: '#1C282E', // Specify your styles for checked state
    },
});

const TextBlock = ({ text }) => {
    return <p>{text}</p>;
};

const CodeBlock = ({ code }) => {
    return (
        <pre className="language-javascript">
            <code
                className="language-javascript"
                dangerouslySetInnerHTML={{ __html: code }}
            />
        </pre>
    );
};

const initialState = {
    checked: false,
    messageParts: [],
    isCodeBlock: false,
    ignoreNextMessage: false,
    isStreamActive: false,
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_CHECKED':
            return { ...state, checked: action.payload };
        case 'SET_MESSAGE_PARTS':
            return { ...state, messageParts: action.payload };
        case 'SET_IS_CODE_BLOCK':
            return { ...state, isCodeBlock: action.payload };
        case 'SET_IGNORE_NEXT_MESSAGE':
            return { ...state, ignoreNextMessage: action.payload };
        case 'SET_IS_STREAM_ACTIVE':
            return { ...state, isStreamActive: action.payload };
        default:
            throw new Error();
    }
}

const AgentMessage = ({ message }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { checked, messageParts, isCodeBlock, ignoreNextMessage } = state;

    const processToken = useCallback(
        async (token) => {
            if (typeof token === 'object') {
                let parts = [];
                let i = 0;
                let processedMessage = await highlightBlockCode(message);
                let message_content = processedMessage.message_content;

                while (message_content.includes('CODEBLOCK' + i)) {
                    let splitMessage = message_content.split('CODEBLOCK' + i);
                    parts.push(
                        <TextBlock key={`text${i}`} text={splitMessage[0]} />
                    );

                    if (
                        processedMessage.codeBlocks &&
                        processedMessage.codeBlocks['CODEBLOCK' + i]
                    ) {
                        parts.push(
                            <CodeBlock
                                key={`code${i}`}
                                code={
                                    processedMessage.codeBlocks['CODEBLOCK' + i]
                                }
                            />
                        );
                    }

                    message_content = splitMessage[1] ? splitMessage[1] : '';
                    i++;
                }

                if (message_content) {
                    parts.push(
                        <TextBlock key={`text${i}`} text={message_content} />
                    );
                }
                dispatch({ type: 'SET_MESSAGE_PARTS', payload: parts });
            } else if (typeof token === 'string') {
                if (message.startsWith('```') || message.startsWith('``')) {
                    if (message.startsWith('``')) {
                        // Ignores next token, sometimes the ending ``` is split into two tokens
                        dispatch({
                            type: 'SET_IGNORE_NEXT_MESSAGE',
                            payload: true,
                        });
                    }
                    if (ignoreNextMessage) {
                        return;
                    }
                    if (isCodeBlock) {
                        // End of code block
                        dispatch({ type: 'SET_IS_CODE_BLOCK', payload: false });
                    } else {
                        // Start of code block
                        dispatch({ type: 'SET_IS_CODE_BLOCK', payload: true });
                    }
                } else if (isCodeBlock) {
                    //Inside code block
                    const part = <CodeBlock key="code" code={token} />;
                    dispatch({ type: 'SET_MESSAGE_PARTS', payload: part });
                } else {
                    // Text block
                    if (
                        messageParts.length > 0 &&
                        messageParts[messageParts.length - 1].type === TextBlock
                    ) {
                        // Update the last TextBlock component
                        const lastPart = messageParts[messageParts.length - 1];
                        lastPart.props.text += token;
                        messageParts[messageParts.length - 1] = lastPart;
                        dispatch({
                            type: 'SET_MESSAGE_PARTS',
                            payload: [...messageParts],
                        });
                    } else {
                        // Create a new TextBlock component
                        console.log('new text block');
                        const part = (
                            <TextBlock
                                key={`text${messageParts.length}`}
                                text={token}
                            />
                        );
                        dispatch({
                            type: 'SET_MESSAGE_PARTS',
                            payload: [...messageParts, part],
                        });
                    }
                }
            }
        },
        [ignoreNextMessage, isCodeBlock, message, messageParts]
    );

    useEffect(() => {
        processToken(message);
    }, [message]);

    const handleCheck = (event) => {
        dispatch({ type: 'SET_CHECKED', payload: event.target.checked });
    };

    return (
        <BotMessageStyled>
            <ListItemIcon>
                <Avatar
                    variant="square"
                    sx={{
                        bgcolor: 'secondary.main',
                    }}
                >
                    <Icon icon="mdi:robot" style={{ fontSize: '33px' }} />
                </Avatar>
            </ListItemIcon>

            <MessageContent>{messageParts}</MessageContent>
            <StyledCheckbox
                checked={checked}
                onChange={handleCheck}
                inputProps={{ 'aris-label': 'Select message' }}
            />
        </BotMessageStyled>
    );
};

export default memo(AgentMessage);
