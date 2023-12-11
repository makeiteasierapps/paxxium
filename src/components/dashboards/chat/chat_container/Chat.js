import { Box, List } from "@mui/material";
import { styled } from "@mui/system";
import {
    memo,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import io from "socket.io-client";
import { AuthContext } from "../../../../contexts/AuthContext";
import { ChatContext } from "../../../../contexts/ChatContext";
import { handleIncomingMessageStream } from "../chat_container/handlers/handleIncomingMessageStream";
import { formatBlockMessage } from "../utils/messageFormatter";
import AgentMessage from "./AgentMessage";
import ChatBar from "./ChatBar";
import MessageInput from "./MessageInput";
import UserMessage from "./UserMessage";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

// STYLED COMPONENTS
const ChatContainerStyled = styled(Box)(() => ({
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

const Chat = ({
    id,
    chatConstants,
    systemPrompt,
    chatName,
    agentModel,
    useProfileData,
}) => {
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
    const fetchMessages = useCallback(async () => {
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
    }, [
        id,
        chatConstants,
        systemPrompt,
        chatName,
        agentModel,
        useProfileData,
        idToken,
        setMessages,
    ]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    useEffect(() => {
        const handleToken = (token) => {
            setQueue((prevQueue) => [...prevQueue, token]);
        };

        socketRef.current = io.connect(backendUrl);
        socketRef.current.emit("join", { room: id });
        socketRef.current.on("token", handleToken);

        return () => {
            socketRef.current.off("token", handleToken);
        };
    }, [id]);

    useEffect(() => {
        const processToken = (token) => {
            const codeStartIndicator = /```/g;
            const codeEndIndicator = /``/g;

            let messageContent = token.message_content;

            if (ignoreNextTokenRef.current) {
                if (token.message_content.trim() !== "`") {
                    // This means the token is not a backtick, so it should be the language
                    languageRef.current = token.message_content.trim();
                }

                // Reset the flag after processing the token, regardless of its content
                ignoreNextTokenRef.current = false;
                return;
            }

            // Check if we are not ignoring this token and if there is a language set
            // This is the next tokenObj after we captured the language.
            if (!ignoreNextTokenRef.current && languageRef.current) {
                // Add the language property to the token object
                token.language = languageRef.current;
                //Removes a new line character
                token.message_content = " ";
                // Reset languageRef as it has been used for this code block
                languageRef.current = null;
            }

            if (ignoreNextTokenRef.current) {
                ignoreNextTokenRef.current = false;

                return;
            }

            if (codeStartIndicator.test(messageContent)) {
                setInsideCodeBlock(
                    (prevInsideCodeBlock) => !prevInsideCodeBlock
                );

                ignoreNextTokenRef.current = true;

                return;
            }

            if (codeEndIndicator.test(messageContent)) {
                setInsideCodeBlock(
                    (prevInsideCodeBlock) => !prevInsideCodeBlock
                );

                ignoreNextTokenRef.current = true;

                return;
            }

            // If we reach here, it means the token is not a code start or end indicator
            // So, we can add it to the messages
            setMessages((prevMessage) => {
                const newMessageParts = handleIncomingMessageStream(
                    prevMessage,
                    id,
                    token,
                    insideCodeBlock
                );
                return newMessageParts;
            });
        };

        if (queue.length > 0) {
            processToken(queue[0]);
            setQueue((prevQueue) => prevQueue.slice(1));
        }
    }, [queue, setMessages, setInsideCodeBlock, insideCodeBlock, id]);

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
                <MessageArea>
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
