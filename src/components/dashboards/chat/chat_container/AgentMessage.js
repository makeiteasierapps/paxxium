import { memo, useEffect, useState, useContext } from 'react';
import { Avatar, ListItem, ListItemIcon, Checkbox } from '@mui/material';
import { styled } from '@mui/system';
import { Icon } from '@iconify/react';
import { blueGrey } from '@mui/material/colors';
import {
    formatBlockMessage,
    formatStreamMessage,
} from '../utils/messageFormatter';
import { ChatContext } from '../../../../contexts/ChatContext';

const AgentMessageContainer = styled(ListItem)({
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

const AgentMessage = ({ message }) => {
    // State for checkbox and processed messages
    const [checked, setChecked] = useState(false);
    const [processedMessages, setProcessedMessages] = useState([]);
    const { insideCodeBlock } = useContext(ChatContext);

    useEffect(() => {
        const fetchProcessedMessages = async () => {
            try {
                if (message.type === 'database') {
                    const result = formatBlockMessage(message);
                    setProcessedMessages(result);
                    console.log(result);
                } else if (message.type === 'stream') {
                    formatStreamMessage(
                        message,
                        insideCodeBlock,
                        setProcessedMessages
                    );
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchProcessedMessages();
    }, [insideCodeBlock, message]);

    return (
        <AgentMessageContainer>
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
                {processedMessages.map((msg, index) => {
                    if (msg.type === 'text') {
                        return <p key={`text${index}`}>{msg.content}</p>;
                    } else if (msg.type === 'code') {
                        return (
                            <pre
                                key={`code${index}`}
                                className={`language-${msg.language}`}
                            >
                                <code
                                    dangerouslySetInnerHTML={{
                                        __html: msg.content,
                                    }}
                                />
                            </pre>
                        );
                    }
                    return null;
                })}
            </MessageContent>
        </AgentMessageContainer>
    );
};

export default memo(AgentMessage);
