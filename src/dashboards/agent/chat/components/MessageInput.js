import React, { useContext, useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { AuthContext, backendUrl } from '../../../../auth/AuthContext';
import { ChatContext } from '../ChatContext';
import { sendMessage, keyDown } from "../handlers/messageInputHandlers";

import {InputArea} from '../../agentStyledComponents';

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
                onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                    }
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
                    );
                }}
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
