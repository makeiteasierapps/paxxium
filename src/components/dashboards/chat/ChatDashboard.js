import React, {
    memo,
    useState,
    useContext,
    useEffect,
    useCallback,
} from 'react';
import { ChatContext } from '../../../contexts/ChatContext';

import { AuthContext } from '../../../contexts/AuthContext';
import { styled, Box } from '@mui/system';
import { Button } from '@mui/material';
import Chat from './chat_container/Chat';
import Debate from '../chat/debate/Debate';

import AgentMenu from './AgentMenu';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

// Styled components
const StyledMain = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100vh', // adjust this as per your needs
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
}));

const ChatsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing(2),
    alignItems: 'c',
}));

const Settings = styled(Box)(({ theme }) => ({
    width: '50%',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.63)',
}));

const SettingsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 0,
    marginBottom: 0,
}));

const ChatDashboard = () => {
    const { setAgentId, agentArray, setAgentArray } = useContext(ChatContext);
    const { idToken } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [settingsOpen, setSettingsOpen] = useState(false);

    useEffect(() => {
        const getChatData = async () => {
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

                const repsonse = await response.json();
                // data is an array of objects
                // Filter the data for is_open before setting the agent array
                const data = repsonse.filter((agent) => agent.is_open);
                setAgentArray(data);

                if (data.length > 0) {
                    setAgentId(data[0]);
                }
            } catch (error) {
                console.error(error);
                setError(error.message);
            }
        };

        getChatData();
    }, [idToken, setAgentArray, setAgentId, setError]);

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <>
            <SettingsContainer>
                {settingsOpen && (
                    <Settings>
                        <AgentMenu />
                    </Settings>
                )}
                <Button onClick={() => setSettingsOpen(!settingsOpen)}>
                    {settingsOpen ? 'Hide' : 'Menu'}
                </Button>
            </SettingsContainer>
            <StyledMain>
                <ChatsContainer>
                    {agentArray.map((agent) => {
                        if (agent.agent_model === 'AgentDebate') {
                            return (
                                <Debate
                                    key={agent.id}
                                    id={agent.id}
                                    chatName={agent.chat_name}
                                    topic={agent.topic}
                                />
                            );
                        } else {
                            return (
                                <Chat
                                    key={agent.id}
                                    id={agent.id}
                                    chatConstants={agent.chat_constants}
                                    systemPrompt={agent.system_prompt}
                                    chatName={agent.chat_name}
                                    agentModel={agent.agent_model}
                                    useProfileData={agent.use_profile_data}
                                />
                            );
                        }
                    })}
                </ChatsContainer>
            </StyledMain>
        </>
    );
};

export default memo(ChatDashboard);
