import { useState, createContext, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const { idToken } = useContext(AuthContext);
    const [profileData, setProfileData] = useState({});
    const [answers, setAnswers] = useState({});

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const handleAnalyzeProfile = async () => {
        try {
            const response = await fetch(`${backendUrl}/profile/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: idToken,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };
    // updates the user's(User.js) profile data
    const handleUserUpdate = async () => {
        await fetch(`${backendUrl}/profile/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: idToken,
            },
            body: JSON.stringify(profileData),
        });
    };

    // updates answers(Questions.js)
    const handleQuestionsUpdate = async () => {
        try {
            const response = await fetch(`${backendUrl}/profile/questions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: idToken,
                },
                credentials: 'include',
                body: JSON.stringify({ answers }),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <ProfileContext.Provider
            value={{
                profileData,
                setProfileData,
                answers,
                setAnswers,
                handleUserUpdate,
                handleQuestionsUpdate,
                handleAnalyzeProfile,
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};
