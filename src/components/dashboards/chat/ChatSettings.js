import { useState, useContext } from 'react';
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

import { SettingsContext } from '../../../contexts/SettingsContext';
import { ChatContext } from '../../../contexts/ChatContext';
import { AuthContext } from '../../../contexts/AuthContext';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

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

const SystemPrompt = styled(TextField)(({ theme }) => ({
    flexGrow: 1,
    paddingRight: theme.spacing(2),
}));

const ChatConstants = styled(TextField)(({ theme }) => ({
    flexGrow: 1,
    paddingRight: theme.spacing(2),
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
    const { settings, setSettings } = useContext(SettingsContext);
    const [agentModel, setAgentModel] = useState(settings.agentModel);
    const [systemPrompt, setSystemPrompt] = useState(settings.systemPrompt);
    const [chatConstants, setChatConstants] = useState(settings.chatConstants);
    const [useProfileData, setUseProfileData] = useState(
        settings.useProfileData
    );
    const [chatName, setChatName] = useState(settings.chatName);
    const { addAgent } = useContext(ChatContext);
    const { idToken } = useContext(AuthContext);

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
            addAgent(data);
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

        // Clear the form
        setAgentModel('');
        setChatName('');
        setUseProfileData(false);
        setSystemPrompt('');
        setChatConstants('');
    };

    const updateSettings = async (id) => {
        const newSettings = {
            id,
            agentModel,
            systemPrompt,
            chatConstants,
            useProfileData,
            chatName,
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
                body: JSON.stringify(newSettings),
            });
        } catch (error) {
            console.error(error);
        }
        // Update the local settings state
        setSettings(newSettings);
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
                            defaultChecked
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
                    onClick={() => updateSettings(settings.id)}
                >
                    Update
                </StyledButton>
            </ButtonContainer>
        </SettingsContainer>
    );
};

export default ChatSettings;
