import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { useContext, useEffect } from 'react';
import {
    Navigate,
    Route,
    BrowserRouter as Router,
    Routes,
} from 'react-router-dom';
import { theme } from './Theme';
import LoginPage from './auth/LoginPage';
import SignUpPage from './auth/SignUpPage';
import ChatDash from './dashboards/agent/AgentDash';
import HomeDash from './dashboards/home/HomeDash';
import TitleBar from './dashboards/main/AppBar';
import MainDash from './dashboards/main/MainDash';
import ProfileDash from './dashboards/profile/ProfileDash';
import { AuthContext, AuthProvider, backendUrl } from './auth/AuthContext';
import { ChatProvider } from './dashboards/agent/chat/ChatContext';
import { NewsProvider } from './dashboards/home/news/NewsContext';
import { ProfileProvider } from './dashboards/profile/ProfileContext';
import './styles/App.css';


const AuthenticatedApp = () => {
    const db = getFirestore();
    const {
        idToken,
        uid,
        user,
        setUid,
        setUsername,
        isAuthorized,
        setIsAuthorized,
    } = useContext(AuthContext);

    const isAuth = localStorage.getItem('isAuthorized') === 'true';

    // Fetches auth status from the db then loads the user into state.
    useEffect(() => {
        if (isAuthorized) return;
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
                        localStorage.setItem('isAuthorized', 'true');
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
            {isAuth && <TitleBar />}
            {isAuth ? (
                <Routes>
                    {['/', '/dashboard', '/home'].map((path, i) => {
                        return (
                            <Route
                                path={path}
                                element={
                                    <MainDash>
                                        <NewsProvider>
                                            <HomeDash />
                                        </NewsProvider>
                                    </MainDash>
                                }
                                key={i}
                            />
                        );
                    })}
                    <Route
                        path="/agents"
                        element={
                            <MainDash>
                                <ChatProvider>
                                    <ChatDash />
                                </ChatProvider>
                            </MainDash>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <MainDash>
                                <ProfileProvider>
                                    <ProfileDash />
                                </ProfileProvider>
                            </MainDash>
                        }
                    />
                </Routes>
            ) : (
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="*" element={<Navigate replace to="/" />} />
                    <Route path="/signup" element={<SignUpPage />} />
                </Routes>
            )}
        </>
    );
};

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <AuthenticatedApp />
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
