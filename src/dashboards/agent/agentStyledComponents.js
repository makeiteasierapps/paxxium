import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import {
    Box,
    List,
    ListItem,
    Button,
    IconButton,
    TextField,
} from '@mui/material';

// AgentDash.js
export const SettingsSubmitButton = styled(Button)(({ theme }) => ({
    backgroundColor: 'transparent',
    fontFamily: 'Titillium Web, sans-serif',
    fontWeight: 'bold',
    fontSize: '1rem',
    '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: 'black',
    },
}));

SettingsSubmitButton.defaultProps = {
    disableRipple: true,
    variant: 'outlined',
};

export const SettingsMenuButton = styled(Button)(({ theme }) => ({
    fontFamily: 'Titillium Web, sans-serif',
    fontWeight: 'bold',
    fontSize: '1rem',
    width: '33%',
    height: '40px',
    backgroundColor: 'transparent',
    '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: 'black',
    },
}));

SettingsMenuButton.defaultProps = {
    disableRipple: true,
    variant: 'outlined',
};

export const InvisibleInput = styled(TextField)({
    '& .MuiInputBase-input': {
        width: '100%',
        height: '40px',
        fontSize: 'inherit',
        padding: 0,
        color: 'black',
    },
    '& .MuiInput-underline:before, & .MuiInput-underline:after': {
        display: 'none',
    },
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            border: 'none',
        },
    },
});

const MotionBox = motion(Box);

export const SettingsMenuContainer = styled(MotionBox)(({ theme }) => ({
    width: '100%',
    maxWidth: 600,
    zIndex: 110,
    top: 100,
    left: 0,
    right: 0,
    margin: 'auto',
    position: 'absolute',
    backgroundColor: theme.palette.background.default,
    boxShadow: `0px 0px 6px 2px ${theme.palette.primary.main}`,
}));

export const ChatContainerStyled = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    marginBottom: theme.spacing(3),
    width: '80%',
    minHeight: '80%',
    height: '87%',
    borderRadius: '7px',
    boxShadow: `0px 0px 6px 2px ${theme.palette.primary.main}`,
    // xs & sm screens: resize to take up most of the screen
    [theme.breakpoints.down('sm')]: {
        minWidth: '100vw',
        maxWidth: '100vw',
        minHeight: '100vh',
        maxHeight: '100vh',
        borderRadius: '0px',
    },
}));

export const MessageArea = styled(List)({
    flexGrow: 1,
    overflowY: 'auto',
    width: '100%',
    padding: '0px',
});

export const MessagesContainer = styled(Box)({
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    whiteSpace: 'pre-line',
});

// Used for Chat, and User
export const MessageContainer = styled(ListItem, {
    shouldForwardProp: (prop) => prop !== 'messageFrom',
})(({ theme, messageFrom }) => ({
    backgroundColor:
        messageFrom === 'user'
            ? theme.palette.background.user
            : theme.palette.background.agent,
    wordBreak: 'break-word',
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'flex-start',
    paddingRight: '50px',
    paddingTop: '20px',
    paddingBottom: '20px',
}));

export const MessageContent = styled(({ imageUrl, ...other }) => (
    <Box {...other} />
))(({ theme, imageUrl }) => ({
    maxHeight: '100%',
    overflowX: 'hidden',
    width: '100%',
    whiteSpace: 'pre-wrap',
    alignSelf: imageUrl ? 'center' : 'flex-start',
    marginLeft: imageUrl ? '10px' : '0px',
}));

// Chatbar
export const Bar = styled(Box)(({ theme }) => ({
    position: 'relative',
    backgroundColor: theme.palette.secondary.dar,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
}));

export const ClearAndTrashIcons = styled(Box)(({ theme }) => ({
    transform: 'translate(10%, -40%)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '9px',
}));

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
    padding: 0,
    color: theme.palette.text.primary,
    '&:hover': {
        backgroundColor: 'transparent',
        color: theme.palette.text.secondary,
    },
}));

export const CloseIconButton = styled(IconButton)(({ theme }) => ({
    transform: 'translate(-60%, -90%)',
    padding: 1,
    boxShadow: '0px 2px 10px 0px rgba(0,0,0,0.43)',
    color: theme.palette.text.primary,
    '&:hover': {
        backgroundColor: 'transparent',
        color: theme.palette.text.secondary,
    },
}));

export const InputArea = styled(Box)({
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
});
