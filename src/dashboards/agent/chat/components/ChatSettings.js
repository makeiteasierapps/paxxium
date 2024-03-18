import {
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    MenuItem,
    TextField,
} from '@mui/material';
import { useContext, useState } from 'react';
import { ChatContext } from '../ChatContext';

const ChatSettings = ({
    chatId,
    chatConstants: initialChatConstants,
    systemPrompt: initialSystemPrompt,
    chatName: initialChatName,
    agentModel: initialAgentModel,
    useProfileData: initialUseProfileData,
}) => {
    const { createChat, updateSettings, agentArray, loadChat } = useContext(ChatContext);

    const [agentModel, setAgentModel] = useState(initialAgentModel);
    const [systemPrompt, setSystemPrompt] = useState(initialSystemPrompt);
    const [chatConstants, setChatConstants] = useState(initialChatConstants);
    const [useProfileData, setUseProfileData] = useState(initialUseProfileData);
    const [chatName, setChatName] = useState(initialChatName);

    const [errors, setErrors] = useState({
        selectModel: '',
        name: '',
    });

    const [selectedAgentId, setSelectedAgentId] = useState('');

    const handleLoadChat = async (event) => {
        const chatId = event.target.value;
        setSelectedAgentId(chatId);
        loadChat(chatId);
    };

    const handleSubmit = () => {
        if (validate()) {
            createChat(
                agentModel,
                systemPrompt,
                chatConstants,
                useProfileData,
                chatName
            );
        }
    };

    const handleUpdateSettings = () => {
        const newAgentSettings = {
            chatId: chatId,
            agent_model: agentModel,
            system_prompt: systemPrompt,
            chat_constants: chatConstants,
            use_profile_data: useProfileData,
            chat_name: chatName,
        };
        updateSettings(newAgentSettings);
    };

    const validate = () => {
        let tempErrors = {};
        tempErrors.selectModel = agentModel ? '' : 'This field is required.';
        tempErrors.name = chatName ? '' : 'This field is required.';
        setErrors({
            ...tempErrors,
        });

        return Object.values(tempErrors).every((x) => x === '');
    };

    return (
        <>
            <Grid item xs={12} sm={3}>
                <Grid item xs={12} sm={9}>
                    <TextField
                        select
                        id="loadChat"
                        name="loadChat"
                        label="Load Chat"
                        fullWidth
                        variant="standard"
                        value={selectedAgentId}
                        onChange={handleLoadChat}
                    >
                        {agentArray.map((agent) => {
                            return (
                                <MenuItem
                                    key={agent.chatId}
                                    value={agent.chatId}
                                >
                                    {agent.chat_name}
                                </MenuItem>
                            );
                        })}
                    </TextField>
                </Grid>
                <TextField
                    error={errors.selectModel ? true : false}
                    helperText={errors.selectModel}
                    required
                    select
                    id="selectModel"
                    name="selectModel"
                    label="Select Model"
                    fullWidth
                    variant="standard"
                    value={agentModel}
                    onChange={(event) => setAgentModel(event.target.value)}
                >
                    <MenuItem value="GPT-3.5">GPT 3.5</MenuItem>
                    <MenuItem value="GPT-4">GPT 4</MenuItem>
                </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
                <TextField
                    error={errors.selectModel ? true : false}
                    helperText={errors.selectModel}
                    required
                    id="name"
                    name="name"
                    label="Name"
                    fullWidth
                    variant="standard"
                    value={chatName}
                    onChange={(event) => setChatName(event.target.value)}
                />
            </Grid>
            <Grid item xs={12} sm={3} md={4} textAlign={'center'}>
                <FormControlLabel
                    control={
                        <Checkbox
                            color="secondary"
                            name="useProfileData"
                            checked={useProfileData}
                            onChange={(event) =>
                                setUseProfileData(event.target.checked)
                            }
                        />
                    }
                    label="AI Insight"
                />
            </Grid>
            <Grid item xs={12} sm={12}>
                <TextField
                    id="systemPrompt"
                    name="systemPrompt"
                    label="Personality/Role"
                    fullWidth
                    variant="standard"
                    value={systemPrompt}
                    onChange={(event) => setSystemPrompt(event.target.value)}
                />
            </Grid>
            <Grid item xs={12} sm={12}>
                <TextField
                    id="chatConstants"
                    name="chatConstants"
                    label="Things to Remember"
                    fullWidth
                    variant="standard"
                    value={chatConstants}
                    onChange={(event) => setChatConstants(event.target.value)}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Button
                    id="createButton"
                    name="createButton"
                    fullWidth
                    variant="contained"
                    onClick={handleSubmit}
                >
                    Create
                </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Button
                    id="updateButton"
                    name="updateButton"
                    fullWidth
                    variant="contained"
                    onClick={handleUpdateSettings}
                >
                    Update
                </Button>
            </Grid>
        </>
    );
};

export default ChatSettings;
