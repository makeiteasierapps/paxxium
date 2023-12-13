import { Button } from "@mui/material";
import { memo, useContext, useEffect, useState } from "react";
import { AuthContext, backendUrl } from "../../auth/AuthContext";
import AgentMenu from "./AgentMenu";
import Chat from "./chat/Chat";
import { ChatContext } from "./chat/ChatContext";
import Debate from "./debate/Debate";

import { Container, Settings, Chats } from "./agentStyledComponents";

const AgentDash = () => {
    const { setSelectedAgent, agentArray, setAgentArray } =
        useContext(ChatContext);
    const { idToken } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [settingsOpen, setSettingsOpen] = useState(false);

    useEffect(() => {
        if (!idToken) return;
        const getChatData = async () => {
            try {
                const response = await fetch(`${backendUrl}/chat`, {
                    method: "GET",
                    headers: {
                        Authorization: idToken,
                    },
                    credentials: "include",
                });

                if (!response.ok)
                    throw new Error("Failed to load user conversations");

                const data = await response.json();
                // data is an array of objects
                setAgentArray(data);

                if (data.length > 0) {
                    setSelectedAgent(data[0]);
                }
            } catch (error) {
                console.error(error);
                setError(error.message);
            }
        };

        getChatData();
    }, [idToken, setAgentArray, setSelectedAgent, setError]);

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <>
            <Container id="settings-container">
                {settingsOpen && (
                    <Settings id="settings">
                        <AgentMenu />
                    </Settings>
                )}
                <Button onClick={() => setSettingsOpen(!settingsOpen)}>
                    {settingsOpen ? "Hide" : "Menu"}
                </Button>
            </Container>
            <Container id="chats-container">
                <Chats id="chats">
                    {agentArray
                        .filter((agent) => agent.is_open)
                        .map((agent) => {
                            if (agent.agent_model === "AgentDebate") {
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
                                        truetoself
                                        useProfileData={agent.use_profile_data}
                                    />
                                );
                            }
                        })}
                </Chats>
            </Container>
        </>
    );
};

export default memo(AgentDash);