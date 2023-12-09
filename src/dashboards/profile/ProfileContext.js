import {
    useState,
    createContext,
    useContext,
    useEffect,
    useCallback,
} from 'react';
import { AuthContext, backendUrl } from '../../contexts/AuthContext';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const { idToken } = useContext(AuthContext);
    const [profileData, setProfileData] = useState({});
    const [analysis, setAnalysis] = useState(null);
    const [answers, setAnswers] = useState({});

    const loadProfile = useCallback(async () => {
        try {
            const response = await fetch(`${backendUrl}/profile`, {
                method: 'GET',
                headers: {
                    Authorization: idToken,
                },
                credentials: 'include',
            });

            const data = await response.json();
            setProfileData(data);
        } catch (error) {
            console.log(error);
        }
    }, [idToken, setProfileData]);

    const getAnswers = useCallback(async () => {
        try {
            const response = await fetch(`${backendUrl}/profile/questions`, {
                method: 'GET',
                headers: {
                    Authorization: idToken,
                },
                credentials: 'include',
            });
            const data = await response.json();
            setAnswers(data.answers);
        } catch (error) {
            console.log(error);
        }
    }, [idToken, setAnswers]);

    const getAnalysis = useCallback(async () => {
        try {
            const response = await fetch(`${backendUrl}/profile/analyze`, {
                method: 'GET',
                headers: {
                    Authorization: idToken,
                },
                credentials: 'include',
            });
            const data = await response.json();
            setAnalysis(data.analysis);
        } catch (error) {
            console.log(error);
        }
    }, [idToken]);

    useEffect(() => {
        if (!idToken) {
            return;
        }
        getAnalysis();
        loadProfile();
        getAnswers();
    }, [loadProfile, getAnswers, idToken, getAnalysis]);

    const handleAnswerChange = (category, question, answer) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [category]: {
                ...(prevAnswers[category] || {}),
                [question]: answer,
            },
        }));
    };

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
            setAnalysis(data['analysis']);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ProfileContext.Provider
            value={{
                profileData,
                setProfileData,
                answers,
                setAnswers,
                handleAnalyzeProfile,
                analysis,
                handleAnswerChange,
                getAnswers,
                loadProfile,
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};
