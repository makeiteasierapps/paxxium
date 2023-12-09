import { React, useContext, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const StyledContainer = styled(Container)(({ theme }) => ({
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

const WelcomeMessageText = styled(Typography)(({ theme }) => ({
    marginTop: theme.spacing(2),
    fontSize: '1.11rem',
    textAlign: 'center',
}));

export default function SignUp() {
    const [formValid, setFormValid] = useState({
        username: true,
        email: true,
        password: true,
        openAiApiKey: true,
        serpApiKey: true,
    });
    const [serverError, setServerError] = useState('');
    const [formValues, setFormValues] = useState({
        username: '',
        email: '',
        password: '',
        openAiApiKey: '',
        serpApiKey: '',
    });
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const auth = getAuth();
    const { idToken } = useContext(AuthContext);

    const isValid = {
        // username must be between 5 and 10 characters long and can only contain alphanumeric characters and underscores
        username: (username) => /^\w{5,10}$/.test(username),
        // Email must be a valid email address
        email: (email) =>
            /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email),
        // Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number
        password: (password) =>
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password),
        // Must not be empty
        openAiApiKey: (key) => key && key.trim().length > 0,
        // Must not be empty
        serpApiKey: (key) => key && key.trim().length > 0,
    };

    const errorMessages = {
        username:
            'Username should be 6 or more characters, and can contain alphanumeric characters and underscore.',
        email: 'Invalid email address.',
        password:
            'Password should be 8 or more characters, and must contain at least one uppercase, one lowercase letter and a digit.',
    };

    const handleInputChange = (event) => {
        const fieldName = event.target.name;
        const value = event.target.value;
        setFormValues({ ...formValues, [fieldName]: value });
        setFormValid({ ...formValid, [fieldName]: isValid[fieldName](value) });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Check if all fields are valid before submitting
        if (Object.values(formValid).every((field) => field)) {
            try {
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    formValues.email,
                    formValues.password
                );
                const user = userCredential.user;
                const uid = user.uid;

                if (!user) {
                    throw new Error('User not created');
                }

                const response = await fetch(`${backendUrl}/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: idToken,
                    },
                    body: JSON.stringify({
                        uid: uid,
                        username: formValues.username,
                        openAiApiKey: formValues.openAiApiKey,
                        serpApiKey: formValues.serpApiKey,
                        authorized: false,
                    }),
                });

                // If the request was not successful, throw an error
                if (!response.ok) {
                    throw new Error('Error when saving user data');
                }

                setOpen(true);
            } catch (error) {
                console.error(error);
                setServerError(error.message);
            }
        }
    };

    return (
        <StyledContainer component="main" maxWidth="xs">
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign up
            </Typography>
            <WelcomeMessageText
                sx={{ mt: 2 }}
                variant="body2"
                color="text.secondary"
            >
                In order to use the app a couple of api keys are needed. OpenAI
                is a paid api but it is very reasonable, and SerpAPI is has a
                generous free tier. I take security serious, keys are encrypted
                using Google's Key Management Service (KMS), stored and used
                only on the server side.
                <br />
                <br />
                Once your account has been approved you will be notified.
            </WelcomeMessageText>
            <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            value={formValues.username}
                            error={!formValid.username}
                            helperText={
                                !formValid.username
                                    ? errorMessages.username
                                    : ''
                            }
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            value={formValues.email}
                            error={!formValid.email}
                            helperText={
                                !formValid.email ? errorMessages.email : ''
                            }
                            autoComplete="email"
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="openAiApiKey"
                            label="OpenAI API Key"
                            name="openAiApiKey"
                            value={formValues.openAiApiKey}
                            error={!formValid.openAiApiKey}
                            helperText={
                                !formValid.openAiApiKey
                                    ? errorMessages.openAiApiKey
                                    : ''
                            }
                            type="password"
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="serpApiKey"
                            label="SerpAPI Key"
                            name="serpApiKey"
                            value={formValues.serpApiKey}
                            error={!formValid.serpApiKey}
                            helperText={
                                !formValid.serpApiKey
                                    ? errorMessages.serpApiKey
                                    : ''
                            }
                            type="password"
                            onChange={handleInputChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            value={formValues.password}
                            error={!formValid.password}
                            helperText={
                                !formValid.password
                                    ? errorMessages.password
                                    : ''
                            }
                            autoComplete="new-password"
                            onChange={handleInputChange}
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Sign Up
                </Button>
                <Grid container justifyContent="center">
                    <Grid item>
                        <Link href="/" variant="body2">
                            Already have an account? Sign in
                        </Link>
                    </Grid>
                </Grid>
            </Box>

            <Dialog
                open={open}
                onClose={() => {
                    setOpen(false);
                    navigate('/');
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {'Request Received'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Your request has been received. You will be contacted
                        when approved.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpen(false);
                            navigate('/');
                        }}
                        color="primary"
                        autoFocus
                    >
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </StyledContainer>
    );
}
