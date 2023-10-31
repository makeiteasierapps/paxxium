import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import CommentsDisabledIcon from "@mui/icons-material/CommentsDisabled";
import { styled } from "@mui/system";

const Bar = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2),
  borderBottom: "1px solid #e0e0e0",
}));

const ChatBarIcons = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
}));

const ChatBar = ({
  chatName,
  id,
  idToken,
  setAgentArray,
  setMessages,
  backendUrl,
}) => {
  // CHATBAR BUTTON HANDLERS
  const handleCloseChat = async () => {
    try {
      const response = await fetch(`${backendUrl}/chat/update_visibility`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: idToken,
        },
        body: JSON.stringify({ id: id, is_open: false }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to update chat");
      setAgentArray((prevChatArray) =>
        prevChatArray.filter((chatObj) => chatObj.id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearMessages = async () => {
    try {
      const response = await fetch(`${backendUrl}/${id}/messages/clear`, {
        method: "DELETE",
        headers: { Authorization: idToken },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to clear messages");
      setMessages([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteChat = async () => {
    try {
      const response = await fetch(`${backendUrl}/chat/${id}/delete`, {
        method: "DELETE",
        headers: { Authorization: idToken },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete conversation");
      setAgentArray((prevChatArray) =>
        prevChatArray.filter((chatObj) => chatObj.id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Bar>
      <Typography variant="h6">{chatName}</Typography>
      <ChatBarIcons>
        <IconButton aria-label="clear_chat" onClick={handleClearMessages}>
          <CommentsDisabledIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={handleDeleteChat}>
          <DeleteIcon />
        </IconButton>
        <IconButton aria-label="close" onClick={handleCloseChat}>
          <CloseIcon />
        </IconButton>
      </ChatBarIcons>
    </Bar>
  );
};

export default ChatBar;
