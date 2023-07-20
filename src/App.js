import React, { useContext, useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    useNavigate,
    Navigate,
} from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import './styles/App.css';
import Dashboard from './components/dashboard/Dashboard';
import CssBaseline from '@mui/material/CssBaseline';
import { ChatProvider } from './contexts/ChatContext';
import { DrawerProvider } from './contexts/DrawerContext';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { ChatContext } from './contexts/ChatContext';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './Theme';
import Navigation from './components/dashboard/Navigation';
import { getFirestore, doc, getDoc } from 'firebase/firestore';


const UnauthenticatedRoutes = () => (
    <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
    </Routes>
);
// If user is authenticated redirect to home
// If user is not authenticated redirect to login
const AuthenticatedRoutes = () => {
    const navigate = useNavigate();
    const { idToken } = useContext(AuthContext);
    
    useEffect(() => {
        if (!idToken) {
            navigate('/');
        } else
            navigate('/home');
    }, [navigate, idToken]);
    
    return (
        <Routes>
            <Route path="/home" element={<Dashboard />} />
            {/* Other authenticated routes */}
        </Routes>
    );
};

// Helper function to render the correct routes
const GateKeeper = ({ isAuthorized }) => {
    return isAuthorized ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />;
};

const AuthenticatedApp = () => {
    const { idToken, uid, user, setUid } = useContext(AuthContext);
    const { setUsername } = useContext(ChatContext);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const db = getFirestore();

    // Fetches auth status from the db then loads the user into state.
    useEffect(() => {
        const fetchData = async () => {
            if (idToken && user) { 
                try {
                    const response = await fetch('http://localhost:5000/auth_check', {
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
                    // Checks if admin as grtanted access to the app
                    if (responseData.authorized) {
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
            {isAuthorized ? <Navigation /> : null}
            <GateKeeper isAuthorized={isAuthorized} />
        </>
    );
};

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
              <ChatProvider>
                <DrawerProvider>
              <Router>
                <AuthenticatedApp />
                </Router>
                </DrawerProvider>
                </ChatProvider>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
