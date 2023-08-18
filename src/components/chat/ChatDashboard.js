import React, {
    memo,
    useState,
    useContext,
    useEffect,
    useCallback,
} from 'react';
import { ChatContext } from '../../contexts/ChatContext';

import { AuthContext } from '../../contexts/AuthContext';
import { styled, Box } from '@mui/system';
import { Button } from '@mui/material';
import Chat from './chat_container/Chat';

import ChatSettings from './ChatSettings';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const StyledMain = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '70vh', // adjust this as per your needs
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
}));

const ChatsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
}));

const SettingsContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

const ChatDashboard = () => {
    const { setChatId, chatArray, setChatArray } = useContext(ChatContext);
    const { idToken } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [settingsOpen, setSettingsOpen] = useState(true);

    // useEffect(() => {
    //     console.log('Chat is mounting');
    //     return () => {
    //         console.log('Chat is unmounting');
    //     };
    // }, []);

    const getChatData = useCallback(async () => {
        try {
            const response = await fetch(`${backendUrl}/chat`, {
                method: 'GET',
                headers: {
                    Authorization: idToken,
                },
                credentials: 'include',
            });

            if (!response.ok)
                throw new Error('Failed to load user conversations');

            const data = await response.json();
            // data is an array of objects
            setChatArray(data);
            if (data.length > 0) {
                setChatId(data[0]);
            }
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    }, [idToken, setChatArray, setChatId, setError]);

    useEffect(() => {
        getChatData();
    }, [getChatData]);

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <StyledMain>
            {settingsOpen && (
                <SettingsContainer>
                    <ChatSettings />
                </SettingsContainer>
            )}
            <Button onClick={() => setSettingsOpen(!settingsOpen)}>
                {settingsOpen ? 'Hide Menu' : 'Chat Menu'}
            </Button>
            <ChatsContainer>
            {chatArray.map((chat) => {
                return (
                    <Chat
                        key={chat.id}
                        id={chat.id}
                        chatConstants={chat.chat_constants}
                        systemPrompt={chat.system_prompt}
                        chatName={chat.chat_name}
                        agentModel={chat.agent_model}
                        useProfileData={chat.use_profile_data}
                    />
                );
            })}
            </ChatsContainer>
        </StyledMain>
    );
};

export default memo(ChatDashboard);
