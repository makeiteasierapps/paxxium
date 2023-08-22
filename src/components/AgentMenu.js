import { useState } from 'react';
import { styled } from '@mui/system';
import {
    TextField,
    MenuItem,
    FormGroup,
} from '@mui/material';

import ChatSettings from './chat/ChatSettings';
import DebateSettings from './debate/DebateSettings';

const SettingsContainer = styled(FormGroup)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
    padding: theme.spacing(2),
    alignItems: 'center',
    
}));

const SelectAgent = styled(TextField)({
    width: '111px',
    alignContent: 'center',
});

export default function AgentMenu() {
    const [selectedAgent, setSelectedAgent] = useState('Chat');

    const handleAgentChange = (event) => {
        setSelectedAgent(event.target.value);
    };

    return (
        <SettingsContainer>
            <SelectAgent
                select
                label="Select Agent"
                value={selectedAgent}
                onChange={handleAgentChange}
                variant="standard"
            >
                <MenuItem value="Chat">Chat</MenuItem>
                <MenuItem value="Debate">Debate</MenuItem>
            </SelectAgent>
            {selectedAgent === 'Chat' ? <ChatSettings /> : <DebateSettings/>}
        </SettingsContainer>
    );
}
