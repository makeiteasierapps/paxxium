import {
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    MenuItem,
    TextField,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { ChatContext } from "../../../contexts/ChatContext";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ChatSettings = () => {
    const { setSelectedAgent, selectedAgent, setAgentArray } =
        useContext(ChatContext);
    const { idToken } = useContext(AuthContext);
    const [agentModel, setAgentModel] = useState("");
    const [systemPrompt, setSystemPrompt] = useState("");
    const [chatConstants, setChatConstants] = useState("");
    const [useProfileData, setUseProfileData] = useState(false);
    const [chatName, setChatName] = useState("");

    useEffect(() => {
        setAgentModel(selectedAgent?.agent_model || "");
        setSystemPrompt(selectedAgent?.system_prompt || "");
        setChatConstants(selectedAgent?.chat_constants || "");
        setUseProfileData(selectedAgent?.use_profile_data || false);
        setChatName(selectedAgent?.chat_name || "");
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
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: idToken,
                },
                credentials: "include",
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
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: idToken,
                },
                credentials: "include",
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
        <>
            <Grid item xs={12} sm={3}>
                <TextField
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
            <Grid item xs={12} sm={3} md={4} textAlign={"center"}>
                <FormControlLabel
                    control={
                        <Checkbox
                            color="secondary"
                            name="useProfileData"
                            defaultChecked
                            onChange={(event) =>
                                setUseProfileData(event.target.checked)
                            }
                        />
                    }
                    label="Use Profile Data"
                />
            </Grid>
            <Grid item xs={12} sm={12}>
                <TextField
                    id="systemPrompt"
                    name="systemPrompt"
                    label="System Prompt"
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
                    label="Chat Constants"
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
                    onClick={() => updateSettings(selectedAgent.id)}
                >
                    Update
                </Button>
            </Grid>
        </>
    );
};

export default ChatSettings;
