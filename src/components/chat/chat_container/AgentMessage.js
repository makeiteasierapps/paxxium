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
    // Specify your styles here
    color: blueGrey[700],
    // Specify your styles for checked state
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

    // useEffect(() => {
    //     console.log('AgentMessage is mounting');
    //     return () => {
    //         console.log('AgentMessage is unmounting');
    //     };
    // }, []);

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
                        const updatedLastPart = React.cloneElement(lastPart, {
                            text: lastPart.props.text + token,
                        });
                        const updatedMessageParts = messageParts.map(
                            (part, index) => {
                                if (index === messageParts.length - 1) {
                                    return updatedLastPart;
                                } else {
                                    return part;
                                }
                            }
                        );
                        dispatch({
                            type: 'SET_MESSAGE_PARTS',
                            payload: updatedMessageParts,
                        });
                    } else {
                        // Create a new TextBlock component
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
            <MessageContent>{messageParts}</MessageContent>
        </BotMessageStyled>
    );
};

export default memo(AgentMessage);
