import React from 'react';
import {
    Avatar,
    ListItem,
    ListItemIcon,
    Checkbox,
} from '@mui/material';
import { styled } from '@mui/system';
import { Icon } from '@iconify/react';
import { blueGrey } from '@mui/material/colors';
import highlightCode from '../../../utils/messageParser';
import { useState, useEffect } from 'react';


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
            <code className="language-javascript" dangerouslySetInnerHTML={{ __html: code }} />
        </pre>
    );
};

const AgentMessage = ({ message }) => {
    const [checked, setChecked] = useState(false);
    const [messageParts, setMessageParts] = useState([]);

    useEffect(() => {
        const processMessage = async () => {
            let parts = [];
            let i = 0;
            let processedMessage = await highlightCode(message);
            let message_content = processedMessage.message_content;
            
            while(message_content.includes('CODEBLOCK' + i)) {
                console.log(message_content);
                console.log(processedMessage.codeBlocks);
                
                let splitMessage = message_content.split('CODEBLOCK' + i);
                parts.push(<p key={`text${i}`}>{splitMessage[0]}</p>); // Added 'text' prefix to ensure uniqueness of keys
                
                if (processedMessage.codeBlocks && processedMessage.codeBlocks['CODEBLOCK' + i]) {
                    parts.push(<CodeBlock key={`code${i}`} code={processedMessage.codeBlocks['CODEBLOCK' + i]} />);
                }
                
                message_content = splitMessage[1] ? splitMessage[1] : '';
                i++;
            }
            
            if(message_content) {
                parts.push(<p key={`text${i}`}>{message_content}</p>);
            }

            setMessageParts(parts);
        };

        processMessage();
    }, [message]);

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
            inputProps={{'aris-label': 'Select message'}}/>
        </BotMessageStyled>
    );
};

export default AgentMessage;
