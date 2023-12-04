import { useState } from 'react';
import {
    Avatar,
    ListItem,
    ListItemIcon,
    ListItemText,
    Checkbox,
} from '@mui/material';
import { styled } from '@mui/system';
import { blueGrey } from '@mui/material/colors';

// Styled components
const UserMessageStyled = styled(ListItem)({
    backgroundColor: blueGrey[800],
    wordBreak: 'break-word',
    alignItems: 'flex-start',
    flexDirection: 'column',
});

const MessageText = styled(ListItemText)({
    wordBreak: 'break-word',
});

const StyledCheckbox = styled(Checkbox)({
    color: blueGrey[800],
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

const UserMessage = ({ message }) => {
    const [checked, setChecked] = useState(false);

    return (
        <UserMessageStyled>
            <StyledHeader>
                <ListItemIcon>
                    <Avatar
                        variant="square"
                        sx={{
                            width: '30px',
                            height: '30px',
                            bgcolor: '#1C282E',
                            color: blueGrey[700],
                            fontSize: '33px',
                        }}
                    />
                </ListItemIcon>
                <StyledCheckbox
                    checked={checked}
                    onChange={(event) => setChecked(event.target.checked)}
                    inputProps={{ 'aris-label': 'Select message' }}
                />
            </StyledHeader>
            <MessageText primary={message.message_content} />
        </UserMessageStyled>
    );
};

export default UserMessage;