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

import { ChatContext } from '../../contexts/ChatContext';
import { AuthContext } from '../../contexts/AuthContext';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

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

const ChatName = styled(TextField)(({theme}) => ({
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

const SystemPrompt = styled(TextField)(({theme}) => ({
    flexGrow: 1,
    paddingRight: theme.spacing(2),
}));

const ChatConstants = styled(TextField)(({theme}) => ({
    flexGrow: 1,
    paddingRight: theme.spacing(2),
}));

const StyledButton = styled(Button)({});

export default function ChatSettings() {
    const [agentModel, setAgentModel] = useState('');
    const [systemPrompt, setSystemPrompt] = useState('');
    const [chatConstants, setChatConstants] = useState('');
    const [useProfileData, setUseProfileData] = useState(false);
    const [chatName, setChatName] = useState('');

    const { addAgent } = useContext(ChatContext);

    const { idToken } = useContext(AuthContext);

    // FORM HANDLERS
    const handleAgentChange = (event) => {
        setAgentModel(event.target.value);
    };

    const handlePromptChange = (event) => {
        setSystemPrompt(event.target.value);
    };

    const handleChatConstantsChange = (event) => {
        setChatConstants(event.target.value);
    };

    const handleUseProfileDataChange = (event) => {
        setUseProfileData(event.target.value);
    };

    const handleChatNameChange = (event) => {
        setChatName(event.target.value);
    };

    // START CHAT
    const startChat = (
        agentModel,
        systemPrompt,
        chatConstants,
        useProfileData,
        chatName
    ) => {
        fetch(`${backendUrl}/chat/create`, {
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
        })
            .then((response) => response.json())
            .then((data) => {
                const newChat = data;
                addAgent(newChat);
            })
            .catch((error) => console.error(error));
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

    return (
        <SettingsContainer>
            <RowOne>
                <AgentDropdown
                    select
                    label="Select Model"
                    value={agentModel}
                    onChange={handleAgentChange}
                    variant="standard"
                >
                    <MenuItem value="GPT-3.5">GPT 3.5</MenuItem>
                    <MenuItem value="GPT-4">GPT 4</MenuItem>
                </AgentDropdown>
                <ChatName
                    label="Name"
                    variant="standard"
                    value={chatName}
                    onChange={handleChatNameChange}
                />
                <FormControlLabel
                    control={
                        <UseProfileCheckbox
                            defaultChecked
                            onChange={handleUseProfileDataChange}
                        />
                    }
                    label="Use Profile Data"
                />
            </RowOne>
            <RowTwo>
                <SystemPrompt
                    label="System Prompt"
                    value={systemPrompt}
                    onChange={handlePromptChange}
                    variant="standard"
                />
                <ChatConstants
                    label="Chat Constants"
                    value={chatConstants}
                    onChange={handleChatConstantsChange}
                    variant="standard"
                />
            </RowTwo>
            <StyledButton variant="contained" onClick={handleSubmit}>
                Create
            </StyledButton>
        </SettingsContainer>
    );
}
