import React from 'react';
import {
    Avatar,
    ListItem,
    ListItemIcon,
    ListItemText,
    Checkbox,
} from '@mui/material';
import { styled } from '@mui/system';
import { Icon } from '@iconify/react';
import { blueGrey } from '@mui/material/colors';

const BotMessageStyled = styled(ListItem)({
    backgroundColor: blueGrey[700],
    wordBreak: 'break-word',
    alignItems: 'flex-start',
});

const MessageText = styled(ListItemText)({
    wordBreak: 'break-word',
});

const StyledCheckbox = styled(Checkbox)({
    color: blueGrey[700], // Specify your styles here
    '&.Mui-checked': {
        color: '#1C282E', // Specify your styles for checked state
    },
});

const AgentMessage = ({ message }) => {
    const [checked, setChecked] = React.useState(false);

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
            <MessageText primary={message.message_content} />
            <StyledCheckbox 
            checked={checked}
            onChange={handleCheck}
            inputProps={{'aris-label': 'Select message'}}/>
        </BotMessageStyled>
    );
};

export default AgentMessage;
