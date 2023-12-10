import { useState, useContext, useEffect } from 'react';
import { styled } from '@mui/system';
import {
    TextField,
    Button,
    MenuItem,
    Box,
    Checkbox,
    FormGroup,
    FormControlLabel,
} from '@mui/material';
import { ChatContext } from '../ChatContext';
import { AuthContext, backendUrl } from '../../../../auth/AuthContext';

// Styled components
const SettingsContainer = styled(FormGroup)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
}));

const RowOne = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
}));

const AgentDropdown = styled(TextField)(({ theme }) => ({
    flexGrow: 1,
    paddingRight: theme.spacing(2),
}));

const ChatName = styled(TextField)(({ theme }) => ({
    flexGrow: 1,
    paddingRight: theme.spacing(2),
}));

const SystemPrompt = styled(TextField)(({ theme }) => ({
    flexGrow: 1,
    paddingRight: theme.spacing(2),
}));

const ChatConstants = styled(TextField)(({ theme }) => ({
    flexGrow: 1,
    paddingRight: theme.spacing(2),
}));

const UseProfileCheckbox = styled(Checkbox)({
    flexGrow: 1,
});

const RowTwo = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
}));
const StyledButton = styled(Button)({
    margin: '0 8px',
});

const ChatSettings = () => {
    const { setSelectedAgent, selectedAgent, setAgentArray } =
        useContext(ChatContext);

    const [agentModel, setAgentModel] = useState('');
    const [systemPrompt, setSystemPrompt] = useState('');
    const [chatConstants, setChatConstants] = useState('');
    const [useProfileData, setUseProfileData] = useState(false);
    const [chatName, setChatName] = useState('');

    const { idToken } = useContext(AuthContext);

    useEffect(() => {
        setAgentModel(selectedAgent?.agent_model || '');
        setSystemPrompt(selectedAgent?.system_prompt || '');
        setChatConstants(selectedAgent?.chat_constants || '');
        setUseProfileData(selectedAgent?.use_profile_data || false);
        setChatName(selectedAgent?.chat_name || '');
    }, [selectedAgent]);

    // START CHAT
    const startChat = async (
        agentModel,
        systemPrompt,
        chatConstants,
        useProfileData,
        chatName
    ) => {
        try {
            const response = await fetch(`${backendUrl}/chat/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: idToken,
                },
                credentials: 'include',
                body: JSON.stringify({
                    agentModel,
                    systemPrompt,
                    chatConstants,
                    useProfileData,
                    chatName,
                }),
            });
            const data = await response.json();
            // Update the agentArray directly here
            setAgentArray((prevAgents) => [data, ...prevAgents]);

            // Set the new agent as the selectedAgent
            setSelectedAgent(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = () => {
        startChat(
            agentModel,
            systemPrompt,
            chatConstants,
            useProfileData,
            chatName
        );
    };

    const updateSettings = async (id) => {
        const newAgentSettings = {
            id: id,
            agent_model: agentModel,
            system_prompt: systemPrompt,
            chat_constants: chatConstants,
            use_profile_data: useProfileData,
            chat_name: chatName,
        };

        // Update the settings in the database
        try {
            await fetch(`${backendUrl}/chat/update_settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: idToken,
                },
                credentials: 'include',
                body: JSON.stringify(newAgentSettings),
            });
        } catch (error) {
            console.error(error);
        }

        // Update the local settings state
        setAgentArray((prevAgentArray) =>
            prevAgentArray.map((agent) =>
                agent.id === id ? { ...agent, ...newAgentSettings } : agent
            )
        );
        // Update the selected agent in the ChatContext
        setSelectedAgent(newAgentSettings);
    };

    return (
        <SettingsContainer>
            <RowOne>
                <AgentDropdown
                    select
                    label="Select Model"
                    value={agentModel}
                    onChange={(event) => setAgentModel(event.target.value)}
                    variant="standard"
                >
                    <MenuItem value="GPT-3.5">GPT 3.5</MenuItem>
                    <MenuItem value="GPT-4">GPT 4</MenuItem>
                </AgentDropdown>
                <ChatName
                    label="Name"
                    variant="standard"
                    value={chatName}
                    onChange={(event) => setChatName(event.target.value)}
                />
                <FormControlLabel
                    control={
                        <UseProfileCheckbox
                            checked={useProfileData}
                            onChange={(event) =>
                                setUseProfileData(event.target.checked)
                            }
                        />
                    }
                    label="Use Profile Data"
                />
            </RowOne>
            <RowTwo>
                <SystemPrompt
                    label="System Prompt"
                    value={systemPrompt}
                    onChange={(event) => setSystemPrompt(event.target.value)}
                    variant="standard"
                />
                <ChatConstants
                    label="Chat Constants"
                    value={chatConstants}
                    onChange={(event) => setChatConstants(event.target.value)}
                    variant="standard"
                />
            </RowTwo>
            <ButtonContainer>
                <StyledButton variant="contained" onClick={handleSubmit}>
                    Create
                </StyledButton>
                <StyledButton
                    variant="contained"
                    onClick={() => updateSettings(selectedAgent.id)}
                >
                    Update
                </StyledButton>
            </ButtonContainer>
        </SettingsContainer>
    );
};

export default ChatSettings;
