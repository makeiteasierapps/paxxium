import { useContext } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import CommentsDisabledIcon from '@mui/icons-material/CommentsDisabled';
import { styled } from '@mui/system';
import { ChatContext } from '../../../../contexts/ChatContext';

import {
    handleClearMessages,
    handleDeleteChat,
    handleCloseChat,
} from './handlers/chatBarHandlers';

const Bar = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderBottom: '1px solid #e0e0e0',
}));

const ChatBarIcons = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
}));

const ChatBar = ({ chatName, id, idToken, backendUrl }) => {
    const { setMessages, setAgentArray } = useContext(ChatContext);
    return (
        <Bar>
            <Typography variant="h6">{chatName}</Typography>
            <ChatBarIcons>
                <IconButton
                    aria-label="clear_chat"
                    onClick={() =>
                        handleClearMessages(
                            id,
                            idToken,
                            setMessages,
                            backendUrl
                        )
                    }
                >
                    <CommentsDisabledIcon />
                </IconButton>
                <IconButton
                    aria-label="delete"
                    onClick={() =>
                        handleDeleteChat(id, idToken, setAgentArray, backendUrl)
                    }
                >
                    <DeleteIcon />
                </IconButton>
                <IconButton
                    aria-label="close"
                    onClick={() =>
                        handleCloseChat(id, idToken, setAgentArray, backendUrl)
                    }
                >
                    <CloseIcon />
                </IconButton>
            </ChatBarIcons>
        </Bar>
    );
};

export default ChatBar;
