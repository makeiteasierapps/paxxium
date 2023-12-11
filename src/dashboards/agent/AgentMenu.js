import { Grid, MenuItem, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { AuthContext, backendUrl } from "../../auth/AuthContext";
import { ChatContext } from "../../dashboards/agent/chat/ChatContext";
import DebateSettings from "../agent/debate/DebateSettings";
import ChatSettings from "./chat/components/ChatSettings";

const AgentMenu = () => {
    const { idToken } = useContext(AuthContext);
    const { agentArray, setAgentArray } = useContext(ChatContext);
    const [selectedAgent, setSelectedAgent] = useState("Chat");
    const [selectedChatId] = useState("");

    const handleLoadChat = async (event) => {
        const selectedId = event.target.value;

        // This is done so that the chat visibility persists even after the page is refreshed
        try {
            const response = await fetch(
                `${backendUrl}/chat/update_visibility`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: idToken,
                    },
                    body: JSON.stringify({ id: selectedId, is_open: true }),
                    credentials: "include",
                }
            );

            if (!response.ok) throw new Error("Failed to update chat");

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
        <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
                <TextField
                    required
                    select
                    id="selectAgent"
                    name="selectAgent"
                    label="Select Agent"
                    fullWidth
                    variant="standard"
                    value={selectedAgent}
                    onChange={(event) => setSelectedAgent(event.target.value)}
                >
                    <MenuItem value="Chat">Chat</MenuItem>
                    <MenuItem value="Debate">Debate</MenuItem>
                </TextField>
            </Grid>
            <Grid item xs={12} sm={9}>
                <TextField
                    select
                    id="loadChat"
                    name="loadChat"
                    label="Load Chat"
                    fullWidth
                    variant="standard"
                    value={selectedChatId}
                    onChange={handleLoadChat}
                >
                    {agentArray.map((agent) => {
                        return (
                            <MenuItem key={agent.id} value={agent.id}>
                                {agent.chat_name}
                            </MenuItem>
                        );
                    })}
                </TextField>
            </Grid>
            {selectedAgent === "Chat" ? <ChatSettings /> : <DebateSettings />}
        </Grid>
    );
};

export default AgentMenu;
