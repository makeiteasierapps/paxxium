import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import './styles/App.css';
import Dashboard from './components/dashboard/Dashboard';
import CssBaseline from '@mui/material/CssBaseline';
import { ChatProvider } from './contexts/ChatContext';
import { DrawerProvider } from './contexts/DrawerContext';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './Theme';
import Navigation from './components/dashboard/Navigation';

const UnauthenticatedRoutes = () => (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
    </Routes>
  );
  
  const AuthenticatedRoutes = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/home');
    }, [navigate]);
    return (
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Dashboard />} />
          {/* Other authenticated routes */}
        </Routes>
    );
};

  

  const AuthenticatedApp = () => {
    const { idToken } = useContext(AuthContext);
    return (
      <ChatProvider>
        <DrawerProvider>
          <Router>
            {idToken ? <Navigation /> : null}
            {idToken ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />}
          </Router>
        </DrawerProvider>
      </ChatProvider>
    );
  };
  

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <AuthenticatedApp />
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;