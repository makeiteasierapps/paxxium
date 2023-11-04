import { useContext, useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    useNavigate,
    Navigate,
} from 'react-router-dom';
import LoginPage from './components/account/LoginPage';
import SignUpPage from './components/account/SignUpPage';
import './styles/App.css';
import Dashboard from './components/dashboards/dashboard/Dashboard';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './Theme';
import TitleBar from './components/dashboards/dashboard/AppBar';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

// If user is authenticated redirect to home
// If user is not authenticated redirect to login
const AuthenticatedRoutes = () => {
    const navigate = useNavigate();
    const { idToken } = useContext(AuthContext);

    useEffect(() => {
        if (!idToken) {
            navigate('/');
        } else navigate('/dashboard');
    }, [navigate, idToken]);

    return <Dashboard />;
};

// Helper function to render the correct routes
const GateKeeper = ({ isAuthorized }) => {
    return (
        <Routes>
            {isAuthorized ? (
                // Authenticated routes
                <>
                    <Route
                        path="/dashboard"
                        element={<AuthenticatedRoutes />}
                    />
                    <Route
                        path="*"
                        element={<Navigate replace to="/dashboard" />}
                    />
                </>
            ) : (
                // Unauthenticated routes
                <>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="*" element={<Navigate replace to="/" />} />
                </>
            )}
        </Routes>
    );
};

const AuthenticatedApp = () => {
    const { idToken, uid, user, setUid } = useContext(AuthContext);
    const { setUsername } = useContext(AuthContext);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const db = getFirestore();

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
            } else if (!idToken && !user) {
                setIsAuthorized(false);
            }
        };

        fetchData();
    }, [db, idToken, setUid, setUsername, user, uid]);

    return (
        <>
            {isAuthorized ? <TitleBar /> : null}
            <GateKeeper isAuthorized={isAuthorized} />
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
