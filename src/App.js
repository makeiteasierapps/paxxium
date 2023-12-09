import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useContext, useEffect } from "react";
import {
    Navigate,
    Route,
    BrowserRouter as Router,
    Routes,
} from "react-router-dom";
import { theme } from "./Theme";
import LoginPage from "./auth/LoginPage";
import SignUpPage from "./auth/SignUpPage";
import ChatDashboard from "./dashboards/agent/ChatDashboard";
import Home from "./dashboards/home/Home";
import TitleBar from "./dashboards/main/AppBar";
import MainDash from "./dashboards/main/MainDash";
import Profile from "./dashboards/profile/Profile";
import { AuthContext, AuthProvider } from "./contexts/AuthContext";
import { ChatProvider } from "./contexts/ChatContext";
import { NewsProvider } from "./contexts/NewsContext";
import { ProfileProvider } from "./contexts/ProfileContext";
import "./styles/App.css";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

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

    const isAuth = localStorage.getItem("isAuthorized") === "true";

    // Fetches auth status from the db then loads the user into state.
    useEffect(() => {
        if (isAuthorized) return;
        const fetchData = async () => {
            if (idToken && user) {
                try {
                    const response = await fetch(`${backendUrl}/auth_check`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
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
                        localStorage.setItem("isAuthorized", "true");
                        setUid(user.uid);
                        const userDoc = await getDoc(doc(db, "users", uid));
                        if (!userDoc.exists()) {
                            throw new Error("No user found in Firestore");
                        }
                        setUsername(userDoc.data().username);
                    }
                } catch (error) {
                    console.error("Failed to fetch:", error);
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
                    {["/", "/dashboard", "/home"].map((path, i) => {
                        return (
                            <Route
                                path={path}
                                element={
                                    <MainDash>
                                        <NewsProvider>
                                            <Home />
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
                                    <ChatDashboard />
                                </ChatProvider>
                            </MainDash>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <MainDash>
                                <ProfileProvider>
                                    <Profile />
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
