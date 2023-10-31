import { useState, useContext, useEffect, useCallback } from "react";
import { styled } from "@mui/system";
import { TextField, MenuItem, FormGroup, Box } from "@mui/material";

import ChatSettings from "./ChatSettings";
import DebateSettings from "../../debate/DebateSettings";

import { AuthContext } from "../../../contexts/AuthContext";
import { ChatContext } from "../../../contexts/ChatContext";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const SettingsContainer = styled(FormGroup)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
}));

const LoadChat = styled(TextField)({
  flex: 1,
  width: "111px",
  alignContent: "center",
});

const SelectAgent = styled(TextField)(({ theme }) => ({
  flex: 1,
  width: "111px",
  alignContent: "center",
  marginRight: theme.spacing(2),
}));

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  paddingBottom: theme.spacing(1),
  width: "100%",
}));

const AgentMenu = () => {
  const [selectedAgent, setSelectedAgent] = useState("Chat");
  const [selectedChatId] = useState("");
  const [chatArray, setChatArray] = useState([]);
  const { idToken } = useContext(AuthContext);
  const { addAgent } = useContext(ChatContext);

  const handleLoadChat = async (event) => {
    const selectedId = event.target.value;
    try {
      const response = await fetch(`${backendUrl}/chat/update_visibility`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: idToken,
        },
        body: JSON.stringify({ id: selectedId, is_open: true }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to update chat");
      // Update the local state only after the database has been updated successfully
      const selectedChat = chatArray.find((chat) => chat.id === selectedId);
      addAgent(selectedChat);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAgentChange = (event) => {
    setSelectedAgent(event.target.value);
  };

  const fetchChats = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/chat`, {
        method: "GET",
        headers: { Authorization: idToken },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed load chat data");
      const data = await response.json();
      setChatArray(data);
    } catch (error) {
      console.log(error);
    }
  }, [idToken]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return (
    <SettingsContainer>
      <Container>
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
        <LoadChat
          select
          label="Load Chat"
          value={selectedChatId}
          onChange={handleLoadChat}
          variant="standard"
        >
          {chatArray.map((chat) => {
            return (
              <MenuItem key={chat.id} value={chat.id}>
                {chat.chat_name}
              </MenuItem>
            );
          })}
        </LoadChat>
      </Container>
      {selectedAgent === "Chat" ? <ChatSettings /> : <DebateSettings />}
    </SettingsContainer>
  );
};

export default AgentMenu;
