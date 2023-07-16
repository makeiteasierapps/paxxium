import React, { createContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  };
  
  // Initialize Firebase
  initializeApp(firebaseConfig);
  

// Get a reference to the Firebase auth service
const auth = getAuth();
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [idToken, setIdToken] = useState(null);
    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                user.getIdToken().then(function (token) {
                    setIdToken(token); // Update the idToken in the state
                });
            } else {
                console.log('No user is signed in.');
            }
        });
    }, []);
    return (
        <AuthContext.Provider value={{ idToken, setIdToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };