import { Button, FormGroup, TextField } from "@mui/material";
import { styled } from "@mui/system";
import { useContext, useState } from "react";
import { AuthContext } from "../../../../contexts/AuthContext";
import { ChatContext } from "../../../../contexts/ChatContext";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

// Styled components
const FormContainer = styled(FormGroup)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
}));

function DebateSettings() {
    const [topic, setTopic] = useState("");
    const [role1Description, setRole1Description] = useState("");
    const [role2Description, setRole2Description] = useState("");
    const { idToken } = useContext(AuthContext);
    const { setAgentArray } = useContext(ChatContext);

    const createDebate = async () => {
        try {
            const response = await fetch(`${backendUrl}/debate/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: idToken,
                },
                credentials: "include",
                body: JSON.stringify({
                    role_1: role1Description,
                    role_2: role2Description,
                    topic: topic,
                }),
            });
            const data = await response.json();
            // Update the agentArray directly here
            setAgentArray((prevAgents) => [data, ...prevAgents]);
        } catch (error) {
            console.error("Failed to start debate:", error);
        }
    };

    return (
        <FormContainer id="debate-form">
            <TextField
                required
                multiline
                id="debate-topic-input"
                name="debate-topic-input"
                label="Debate Topic"
                sx={{ paddingBottom: "1rem" }}
                fullWidth
                variant="outlined"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
            />
            <TextField
                required
                multiline
                id="role1-description-input"
                name="role1-description-input"
                label="Role 1 Description"
                sx={{ paddingBottom: "1rem" }}
                fullWidth
                variant="outlined"
                value={role1Description}
                onChange={(event) => setRole1Description(event.target.value)}
            />
            <TextField
                required
                multiline
                id="role2-description-input"
                name="role2-description-input"
                label="Role 2 Description"
                sx={{ paddingBottom: "1rem" }}
                fullWidth
                variant="outlined"
                value={role2Description}
                onChange={(event) => setRole2Description(event.target.value)}
            />
            <Button
                type="submit"
                id="start-debate-button"
                name="start-debate-button"
                fullWidth
                variant="contained"
                onClick={(event) => {
                    event.preventDefault();
                    createDebate();
                }}
            >
                Start Debate
            </Button>
        </FormContainer>
    );
}

export default DebateSettings;
