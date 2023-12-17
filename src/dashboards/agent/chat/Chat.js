import { memo, useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { AuthContext, backendUrl } from "../../../auth/AuthContext";
import { ChatContext } from "../../../dashboards/agent/chat/ChatContext";
import { handleIncomingMessageStream } from "../chat/handlers/handleIncomingMessageStream";
import { formatBlockMessage } from "../utils/messageFormatter";
import { processToken } from "../utils/processToken";
import AgentMessage from "./components/AgentMessage";
import ChatBar from "./components/ChatBar";
import MessageInput from "./components/MessageInput";
import UserMessage from "./components/UserMessage";
import {
    MessagesContainer,
    MessageArea,
    ChatContainerStyled,
} from "../agentStyledComponents";

const Chat = ({
    id,
    chatConstants,
    systemPrompt,
    chatName,
    agentModel,
    useProfileData,
}) => {
    const nodeRef = useRef(null);
    const socketRef = useRef(null);
    const [queue, setQueue] = useState([]);
    const ignoreNextTokenRef = useRef(false);
    const languageRef = useRef("markdown");

    const {
        messages,
        setMessages,
        setInsideCodeBlock,
        insideCodeBlock,
        setSelectedAgent,
        agentArray,
    } = useContext(ChatContext);

    const { idToken } = useContext(AuthContext);

    // Fetch messages from the database
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const requestData = {
                    id,
                    chatConstants,
                    systemPrompt,
                    chatName,
                    agentModel,
                    useProfileData,
                };

                const messageResponse = await fetch(
                    `${backendUrl}/${id}/messages`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: idToken,
                        },
                        credentials: "include",
                        body: JSON.stringify(requestData),
                    }
                );

                if (!messageResponse.ok) {
                    throw new Error("Failed to load messages");
                }

                const messageData = await messageResponse.json();
                if (messageData && messageData.messages.length > 0) {
                    setMessages((prevMessageParts) => ({
                        ...prevMessageParts,
                        [id]: messageData.messages,
                    }));
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchMessages();
    }, [id, idToken, setMessages]);

    useEffect(() => {
        const handleToken = (token) => {
            setQueue((prevQueue) => [...prevQueue, token]);
        };

        socketRef.current = io.connect(backendUrl);
        socketRef.current.emit("join", { room: id });
        socketRef.current.on("token", handleToken);

        return () => {
            socketRef.current.off("token", handleToken);
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [id]);

    useEffect(() => {
        if (queue.length > 0) {
            processToken(
                queue[0],
                setInsideCodeBlock,
                insideCodeBlock,
                setMessages,
                handleIncomingMessageStream,
                id,
                ignoreNextTokenRef,
                languageRef
            );

            setQueue((prevQueue) => prevQueue.slice(1));
        }
    }, [queue, setMessages, setInsideCodeBlock, insideCodeBlock, id]);

    // scrolls chat window to the bottom
    useEffect(() => {
        const node = nodeRef.current;
        node.scroll(0, node.scrollHeight);
    }, [messages]);

    return (
        <ChatContainerStyled
            onClick={() => {
                const selectedAgent = agentArray.find(
                    (agent) => agent.id === id
                );
                setSelectedAgent(selectedAgent);
            }}
        >
            <ChatBar
                chatName={chatName}
                id={id}
                idToken={idToken}
                backendUrl={backendUrl}
            />
            <MessagesContainer item xs={9} id="messages-container">
                <MessageArea ref={nodeRef}>
                    {messages[id]?.map((message, index) => {
                        let formattedMessage = message;
                        if (message.type === "database") {
                            if (message.message_from === "agent") {
                                formattedMessage = formatBlockMessage(message);
                                return (
                                    <AgentMessage
                                        key={`agent${index}`}
                                        message={formattedMessage}
                                        id={id}
                                    />
                                );
                            } else {
                                return (
                                    <UserMessage
                                        key={`user${index}`}
                                        message={message}
                                    />
                                );
                            }
                        } else {
                            return (
                                <AgentMessage
                                    key={`stream${index}`}
                                    message={message}
                                />
                            );
                        }
                    })}
                </MessageArea>
                <MessageInput
                    chatId={id}
                    agentModel={agentModel}
                    systemPrompt={systemPrompt}
                    chatConstants={chatConstants}
                />
            </MessagesContainer>
        </ChatContainerStyled>
    );
};

export default memo(Chat);
