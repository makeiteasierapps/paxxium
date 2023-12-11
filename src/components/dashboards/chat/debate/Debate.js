import { Box, List } from "@mui/material";
import { styled } from "@mui/system";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { AuthContext } from "../../../../contexts/AuthContext";
import ChatBar from "../chat_container/ChatBar";
import DebateMessage from "./DebateMessage";

// Syled components
const DebateContainerStyled = styled(Box)(() => ({
    height: "75vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.63)",
    overflow: "auto",
    borderRadius: "5px",
}));

const MessageArea = styled(List)({
    flexGrow: 1,
    overflowY: "auto",
    width: "100%",
});

const MessagesContainer = styled("div")({
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    whiteSpace: "pre-line",
});

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Debate = ({ id, chatName, topic }) => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    const { uid, idToken } = useContext(AuthContext);

    const fetchMessages = useCallback(async () => {
        try {
            const requestData = {
                agentModel: "AgentDebate",
            };
            const response = await fetch(`${backendUrl}/${id}/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: idToken,
                },
                credentials: "include",
                body: JSON.stringify(requestData),
            });
            if (!response.ok) throw new Error("Failed to fetch messages");
            const data = await response.json();
            setMessages(data.messages);
            return data.messages; // Add this line
        } catch (error) {
            console.error(error);
            return []; // Return an empty array in case of an error
        }
    }, [id, idToken]);

    // Initialize socket connection
    useEffect(() => {
        const newSocket = io.connect(backendUrl);
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on("debate_started", (data) => {
            setMessages((prevMessages) => [...prevMessages, data.message]);

            // Continue the debate if there are more turns
            if (data.hasMoreTurns) {
                socket.emit("start_debate", {
                    uid_debate_id_tuple: [uid, id],
                    topic: topic,
                    turn: messages.length, // The turn is the current number of messages
                });
            }
        });

        return () => socket.off("debate_started");
    }, [socket, messages, uid, id, topic]);

    useEffect(() => {
        // Start the debate when the component mounts
        const startDebate = async (turn = 0) => {
            if (!socket) return;

            // Try to fetch messages first
            const messages = await fetchMessages();
            if (messages.length > 0) {
                setMessages(messages);
                return;
            }

            // Join the room named after the debate's id
            socket.emit("join", { room: id });

            // Send 'start_debate' event to the server
            socket.emit("start_debate", {
                uid_debate_id_tuple: [uid, id],
                topic: topic,
                turn: turn,
            });
        };
        startDebate();
    }, [fetchMessages, id, socket, topic, uid]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages]);

    return (
        <DebateContainerStyled>
            <ChatBar chatName={chatName} id={id} />
            <MessagesContainer item xs={9}>
                <MessageArea>
                    {messages.map((message, index) => {
                        if (message) {
                            if (message.message_from === "agent1") {
                                return (
                                    <DebateMessage
                                        key={index}
                                        message={message}
                                        agent="agent1"
                                    />
                                );
                            } else if (message.message_from === "agent2") {
                                return (
                                    <DebateMessage
                                        key={index}
                                        message={message}
                                        agent="agent2"
                                    />
                                );
                            }
                        }
                        return null; // return null when the message doesn't exist
                    })}
                    <div ref={messagesEndRef} />
                </MessageArea>
            </MessagesContainer>
        </DebateContainerStyled>
    );
};

export default Debate;
