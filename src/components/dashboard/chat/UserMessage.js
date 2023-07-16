import React from 'react';
import {
    Avatar,
    ListItem,
    ListItemIcon,
    ListItemText,
    Checkbox,
} from '@mui/material';
import { styled } from '@mui/system';
import { blueGrey } from '@mui/material/colors';

const UserMessageStyled = styled(ListItem)({
    backgroundColor: blueGrey[800],
    wordBreak: 'break-word',
    alignItems: 'flex-start',
});

const MessageText = styled(ListItemText)({
    wordBreak: 'break-word',
});

const StyledCheckbox = styled(Checkbox)({
    color: blueGrey[800], // Specify your styles here
    '&.Mui-checked': {
        color: '#1C282E', // Specify your styles for checked state
    },
});

const UserMessage = ({ message }) => {
    const [checked, setChecked] = React.useState(false);

    const handleCheck = (event) => {
        setChecked(event.target.checked);
    };
    return (
        <UserMessageStyled>
            <ListItemIcon>
                <Avatar
                    variant="square"
                    sx={{
                        bgcolor: '#1C282E',
                        color: blueGrey[700],
                        fontSize: '33px',
                    }}
                />
            </ListItemIcon>
            <MessageText primary={message.message_content} />
            <StyledCheckbox
                checked={checked}
                onChange={handleCheck}
                inputProps={{ 'aris-label': 'Select message' }}
            />
        </UserMessageStyled>
    );
};

export default UserMessage;
