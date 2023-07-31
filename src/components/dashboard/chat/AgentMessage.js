import React from 'react';
import { Avatar, ListItem, ListItemIcon, Checkbox } from '@mui/material';
import { styled } from '@mui/system';
import { Icon } from '@iconify/react';
import { blueGrey } from '@mui/material/colors';
import { highlightBlockCode } from '../../../utils/messageParser';
import { useState, useEffect, useContext } from 'react';
import { ChatContext } from '../../../contexts/ChatContext';

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

const AgentMessage = ({ message }) => {
    const [checked, setChecked] = useState(false);
    const [messageParts, setMessageParts] = useState([]);
    const { isCodeBlock, setIsCodeBlock } = useContext(ChatContext);

    useEffect(() => {
        const processMessage = async () => {
            if (typeof message === 'object') {
                let parts = [];
                let i = 0;
                let processedMessage = await highlightBlockCode(message);
                let message_content = processedMessage.message_content;

                while (message_content.includes('CODEBLOCK' + i)) {
                    let splitMessage = message_content.split('CODEBLOCK' + i);
                    parts.push(<p key={`text${i}`}>{splitMessage[0]}</p>); // Added 'text' prefix to ensure uniqueness of keys

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
                    parts.push(<p key={`text${i}`}>{message_content}</p>);
                }
                setMessageParts(parts);
            } else if (typeof message === 'string') {
                console.log(message);
                if (isCodeBlock) {
                    setMessageParts((prevParts) => [
                        ...prevParts,
                        <CodeBlock
                            key={`code${prevParts.length}`}
                            code={message}
                        />,
                    ]);
                } else {
                    setMessageParts((prevParts) => [
                        <p key={`text${prevParts.length}`}>{message}</p>,
                    ]);
                }
            }
        };

        processMessage();
    }, [isCodeBlock, message]);

    const handleCheck = (event) => {
        setChecked(event.target.checked);
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

export default AgentMessage;
