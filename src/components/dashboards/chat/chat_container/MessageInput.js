import React, { useContext, useState, useEffect, useRef } from "react";
import Prism from "prismjs";
import io from "socket.io-client";
import "prismjs/components/prism-javascript.min";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-okaidia.css";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { styled } from "@mui/system";
import { AuthContext } from "../../../../contexts/AuthContext";
import { ChatContext } from "../../../../contexts/ChatContext";
import { sendMessage, keyDown } from "./handlers/messageInputHandlers";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const InputArea = styled("div")({
  padding: "20px",
  display: "flex",
  alignItems: "center", // Vertically center children
  justifyContent: "space-between",
});

const MessageInput = ({ chatId, agentModel }) => {
  const { uid, idToken } = useContext(AuthContext);
  const { addMessage } = useContext(ChatContext);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);

  // Set up the socket connection on mount and disconnect on unmount.
  useEffect(() => {
    socketRef.current = io.connect(backendUrl);

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <InputArea>
      <TextField
        label="Type Something"
        fullWidth
        multiline
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={(event) =>
          keyDown(
            event,
            input,
            uid,
            addMessage,
            socketRef,
            idToken,
            chatId,
            agentModel,
            setInput
          )
        }
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                color="primary"
                aria-label="send message"
                onClick={() => {
                  sendMessage(
                    input,
                    uid,
                    addMessage,
                    socketRef,
                    idToken,
                    chatId,
                    agentModel
                  );
                  setInput("");
                }}
              >
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </InputArea>
  );
};

export default MessageInput;
