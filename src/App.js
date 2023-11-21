import { useContext, useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    useNavigate,
    Navigate,
} from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import SignUpPage from './components/auth/SignUpPage';
import './styles/App.css';
import MainDash from './components/dashboards/main/MainDash';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './Theme';
import TitleBar from './components/dashboards/main/AppBar';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AuthenticatedApp = () => {
    const { idToken, uid, user, setUid, setUsername, isAuthorized, setIsAuthorized } = useContext(AuthContext);
    
    const db = getFirestore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!idToken) {
            navigate('/');
        } else if (isAuthorized) {
            navigate('/dashboard');
        }
    }, [idToken, isAuthorized, navigate]);

    // Fetches auth status from the db then loads the user into state.
    useEffect(() => {
        const fetchData = async () => {
            if (idToken && user) {
                try {
                    const response = await fetch(`${backendUrl}/auth_check`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: idToken,
                        },
                        body: JSON.stringify({
                            uid: uid,
                        }),
                    });

                    const responseData = await response.json();

                    // Checks if admin has grtanted access to the app
                    if (responseData.auth_status) {
                        setIsAuthorized(true);
                        setUid(user.uid);
                        const userDoc = await getDoc(doc(db, 'users', uid));
                        if (!userDoc.exists()) {
                            throw new Error('No user found in Firestore');
                        }
                        setUsername(userDoc.data().username);
                    }
                } catch (error) {
                    console.error('Failed to fetch:', error);
                }
            }
        };

        fetchData();
    }, [db, idToken, setUid, setUsername, user, uid, setIsAuthorized]);

    return (
        <>
            {isAuthorized && <TitleBar />}
            <Routes>
                {isAuthorized ? (
                    <>
                        <Route path="/dashboard" element={<MainDash />} />
                        <Route
                            path="*"
                            element={<Navigate replace to="/dashboard" />}
                        />
                    </>
                ) : (
                    <>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="*" element={<Navigate replace to="/" />} />
                    </>
                )}
            </Routes>
        </>
    );
};

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <SettingsProvider>
                    <Router>
                        <AuthenticatedApp />
                    </Router>
                </SettingsProvider>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
