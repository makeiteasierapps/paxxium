import { Box, Tabs, TextField, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';

export const MainContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
    gap: theme.spacing(10),
    margin: 'auto',
    maxWidth: '1200px',
    boxShadow: `0px 0px 6px 2px ${theme.palette.primary.main}`,
}));

export const StyledTabs = styled(Tabs)(({ theme }) => ({
    width: '100%',
    marginBottom: theme.spacing(1),
    '& .MuiTabs-indicator': {
        display: 'none',
    },
    '& .MuiTabs-flexContainer': {
        justifyContent: 'center',
    },
    '& .MuiTab-root': {
        padding: theme.spacing(1),
        color: theme.palette.text.primary,
        '&:hover': {
            color: theme.palette.text.secondary,
        },
        '&.Mui-selected': {
            color: theme.palette.text.secondary,
        },
    },
}));

export const QuestionsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '50vh',
    overflowY: 'scroll',
    marginTop: theme.spacing(2),
}));

export const Question = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
}));

export const Answer = styled(TextField)(({ theme }) => ({
    // The marginBottom property adds space below the TextField
    marginBottom: theme.spacing(2),
    // The '& .MuiOutlinedInput-root' selector targets the root of the OutlinedInput component
    '& .MuiOutlinedInput-root': {
        // The '& fieldset' selector targets the fieldset element within the OutlinedInput component
        '& fieldset': {
            // The borderColor property changes the color of the border
            borderColor: theme.palette.secondary.light,
        },
        // The '&:hover fieldset' selector targets the fieldset element when the mouse pointer is over the OutlinedInput component
        '&:hover fieldset': {
            borderColor: theme.palette.secondary.light,
        },
        // The '&.Mui-disabled fieldset' selector targets the fieldset element when the OutlinedInput component is disabled
        '&.Mui-disabled fieldset': {
            borderColor: theme.palette.secondary.dark,
        },
    },
    // The '& label.Mui-focused' selector targets the label element when the TextField component is focused
    '& label.Mui-focused': {
        color: theme.palette.secondary.light,
    },
}));

export const UserContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
    margin: 'auto',
    width: '100%',
    maxWidth: '800px',
    height: '50%',
    backgroundColor: theme.palette.background.paper,
}));

export const AvatarContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(4),
}));

export const StyledAvatar = styled('img')(({ theme }) => ({
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    cursor: 'pointer',
    margin: theme.spacing(1),
    backgroundColor: 'black',
}));

export const StyledAvatarPlaceholder = styled(Box)(({ theme }) => ({
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgray',
    color: 'black',
    fontSize: '14px',
    textAlign: 'center',
    padding: theme.spacing(1),
    cursor: 'pointer',
}));

export const TextFieldContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'center',
}));

export const Username = styled(Typography)(({ theme }) => ({
    fontSize: '2rem',
    marginLeft: theme.spacing(3),
    color: theme.palette.text.primary,
}));

export const ProfileTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    margin: theme.spacing(1),
    width: '100%',
    borderRadius: '5px',
    padding: 0,
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: theme.palette.secondary.light,
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.secondary.light,
        },
        '&:hover fieldset': {
            borderColor: theme.palette.secondary.light,
        },
        '&.Mui-disabled fieldset': {
            borderColor: theme.palette.primary.main,
        },
    },
    '& input:-webkit-autofill': {
        WebkitBoxShadow: `0 0 0px 1000px ${theme.palette.background.paper} inset`,
        WebkitTextFillColor: theme.palette.text.primary,
        transition: 'background-color 5000s ease-in-out 0s',
    },
    '& label.Mui-focused': {
        color: theme.palette.secondary.light,
    },
    '& .MuiInputLabel-outlined': {
        color: theme.palette.secondary.light,
    },
}));

export const StyledButton = styled(Button)(({ theme }) => ({
    fontFamily: 'Titillium Web, sans-serif',
    fontWeight: 'bold',
    fontSize: '1rem',
    backgroundColor: 'transparent',
    '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: 'black',
    },
}));

StyledButton.defaultProps = {
    disableRipple: true,
    variant: 'outlined',
};
