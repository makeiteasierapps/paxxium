import { useState, useContext, useEffect, useCallback } from 'react';
import { styled } from '@mui/system';
import { TextField, MenuItem, FormGroup, Box } from '@mui/material';
import ChatSettings from './ChatSettings';
import DebateSettings from '../chat/debate/DebateSettings';
import { AuthContext } from '../../../contexts/AuthContext';
import { ChatContext } from '../../../contexts/ChatContext';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

// Styled components
const SettingsContainer = styled(FormGroup)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
}));

const LoadChat = styled(TextField)({
    flex: 1,
    width: '111px',
    alignContent: 'center',
});

const SelectAgent = styled(TextField)(({ theme }) => ({
    flex: 1,
    width: '111px',
    alignContent: 'center',
    marginRight: theme.spacing(2),
}));

const Container = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: theme.spacing(1),
    width: '100%',
}));

const AgentMenu = () => {
    const [selectedAgent, setSelectedAgent] = useState('Chat');
    const [selectedChatId] = useState('');
    const { idToken } = useContext(AuthContext);
    const { agentArray, setAgentArray } = useContext(ChatContext);

    const handleLoadChat = async (event) => {
        const selectedId = event.target.value;

        // This is done so that the chat visibility persists even after the page is refreshed
        try {
            const response = await fetch(
                `${backendUrl}/chat/update_visibility`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: idToken,
                    },
                    body: JSON.stringify({ id: selectedId, is_open: true }),
                    credentials: 'include',
                }
            );

            if (!response.ok) throw new Error('Failed to update chat');

            // Update the local state only after the database has been updated successfully
            setAgentArray((prevAgents) =>
                prevAgents.map((agent) =>
                    agent.id === selectedId
                        ? { ...agent, is_open: true }
                        : agent
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <SettingsContainer>
            <Container>
                <SelectAgent
                    select
                    label="Select Agent"
                    value={selectedAgent}
                    onChange={(event) => setSelectedAgent(event.target.value)}
                    variant="standard"
                >
                    <MenuItem value="Chat">Chat</MenuItem>
                    <MenuItem value="Debate">Debate</MenuItem>
                </SelectAgent>
                <LoadChat
                    select
                    label="Load Chat"
                    value={selectedChatId}
                    onChange={handleLoadChat}
                    variant="standard"
                >
                    {agentArray.map((agent) => {
                        return (
                            <MenuItem key={agent.id} value={agent.id}>
                                {agent.chat_name}
                            </MenuItem>
                        );
                    })}
                </LoadChat>
            </Container>
            {selectedAgent === 'Chat' ? <ChatSettings /> : <DebateSettings />}
        </SettingsContainer>
    );
};

export default AgentMenu;
