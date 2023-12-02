import { useContext, useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    useNavigate,
    Navigate,
    useLocation,
} from "react-router-dom";
import LoginPage from "./components/auth/LoginPage";
import SignUpPage from "./components/auth/SignUpPage";
import "./styles/App.css";
import MainDash from "./components/dashboards/main/MainDash";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./Theme";
import TitleBar from "./components/dashboards/main/AppBar";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import ChatDashboard from "./components/dashboards/chat/ChatDashboard";
import Home from "./components/dashboards/home/Home";
import Profile from "./components/dashboards/profile/Profile";
import { ChatProvider } from "./contexts/ChatContext";
import { NewsProvider } from "./contexts/NewsContext";
import { ProfileProvider } from "./contexts/ProfileContext";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AuthenticatedApp = () => {
    const [lastVisitedRoute, setLastVisitedRoute] = useState("");
    const {
        idToken,
        uid,
        user,
        setUid,
        setUsername,
        isAuthorized,
        setIsAuthorized,
    } = useContext(AuthContext);

    const db = getFirestore();
    const navigate = useNavigate();
    const location = useLocation();

    // useEffect(() => {
    //     // Get the last visited route from storage on initial load
    //     const lastRoute = localStorage.getItem("lastVisitedRoute");
    //     if (lastRoute) {
    //         setLastVisitedRoute(lastRoute);
    //     }
    // }, []);

    // useEffect(() => {
    //     // Update lastVisitedRoute in storage when location changes
    //     setLastVisitedRoute(location.pathname);
    //     localStorage.setItem("lastVisitedRoute", location.pathname);
    // }, [location.pathname]);

    // Fetches auth status from the db then loads the user into state.
    useEffect(() => {
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
            {isAuthorized && <TitleBar />}
            <Routes>
                {isAuthorized ? (
                    <>
                        <Route
                            path="/"
                            element={
                                <Navigate
                                    replace
                                    to={lastVisitedRoute || "/home"}
                                />
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                <Navigate
                                    replace
                                    to={lastVisitedRoute || "/home"}
                                />
                            }
                        />
                        <Route
                            path="/home"
                            element={
                                <MainDash>
                                    <NewsProvider>
                                        <Home />
                                    </NewsProvider>
                                </MainDash>
                            }
                        />
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
                    </>
                ) : (
                    <>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="*" element={<Navigate replace to="/" />} />
                        <Route path="/signup" element={<SignUpPage />} />
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
                <Router>
                    <AuthenticatedApp />
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
