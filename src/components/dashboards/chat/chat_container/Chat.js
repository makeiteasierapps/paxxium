import React, {
  useRef,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { styled } from "@mui/system";
import { List, Box } from "@mui/material";

import io from "socket.io-client";

import MessagesContainer from "./MessagesContainer";
import AgentMessage from "./AgentMessage";
import UserMessage from "./UserMessage";
import MessageInput from "./MessageInput";
import ChatBar from "./ChatBar";

import { AuthContext } from "../../../../contexts/AuthContext";
import { ChatContext } from "../../../../contexts/ChatContext";
import { SettingsContext } from "../../../../contexts/SettingsContext";
import { processToken } from "../../../../utils/ProcessToken";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

// STYLED COMPONENTS
const ChatContainerStyled = styled(Box)(({ theme }) => ({
  height: "80vh",
  width: "70%",
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

const Chat = ({
  id,
  chatConstants,
  systemPrompt,
  chatName,
  agentModel,
  useProfileData,
}) => {
  const isCodeBlockRef = useRef(false);
  const codeRef = useRef("");
  const langRef = useRef("markdown");
  const tokenizedCodeRef = useRef([]);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const isProcessing = useRef(false);
  const tokenQueue = useRef([]);
  const ignoreNextToken = useRef(false);
  const isQueueProcessing = useRef(false);
  const { setAgentArray } = useContext(ChatContext);
  const { idToken } = useContext(AuthContext);
  const { setSettings } = useContext(SettingsContext);
  const [messages, setMessages] = useState([]);
  const [streamingMessageParts, setStreamingMessageParts] = useState([]);

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
      const url = `${backendUrl}/${id}/messages`;
      const messageResponse = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: idToken,
        },
        credentials: "include",
        body: JSON.stringify(requestData),
      });
      if (!messageResponse.ok) {
        throw new Error("Failed to load messages");
      }

      const messageData = await messageResponse.json();
      if (messageData && messageData.messages.length > 0) {
        setMessages(messageData.messages);
      } else {
        setMessages([]);
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
  ]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Update the message state with the streamed message.
  useEffect(() => {
    socketRef.current = io.connect(backendUrl);
    // I need to reset the message state beacuse my logic looks for a string as a
    // signal for a streaming message and an object for a regular message.
    // On the backend when the message is done streaming it is added to the database
    // Setting the message here is fetching the message from the database and adding it to the state.
    // I think I can find a more efficient way of doing this.
    const handleMessage = async (message) => {
      setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, message]);
        setStreamingMessageParts([]);
      }, 100);
    };

    socketRef.current.on("message", (message) => {
      handleMessage(message);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Process the token and update the message state.
  const processTokenCallback = useCallback(async (token) => {
    const refs = {
      isCodeBlockRef,
      codeRef,
      langRef,
      tokenizedCodeRef,
      ignoreNextToken,
      isProcessing,
    };
    await processToken(token, refs, setStreamingMessageParts);
  }, []);

  const handleToken = useCallback(
    async (token) => {
      if (id === token.chat_id) {
        if (isProcessing.current || isQueueProcessing.current) {
          tokenQueue.current.push(token.token);
          console.log("queue", tokenQueue.current);
          return;
        }

        isProcessing.current = true;
        await processTokenCallback(token.token);
        isProcessing.current = false;

        if (tokenQueue.current.length > 0) {
          isQueueProcessing.current = true;
          const nextToken = tokenQueue.current.shift();
          await processTokenCallback(nextToken);
          isQueueProcessing.current = false;
        }
      }
    },
    [id, processTokenCallback]
  );

  useEffect(() => {
    // Register the event listener for incoming tokens.
    socketRef.current.on("token", handleToken);

    // Clean up by removing the event listener when the component is unmounted.
    return () => {
      socketRef.current.off("token", handleToken);
    };
  }, [handleToken, id, processTokenCallback]);

  // const scrollToBottom = () => {
  //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // };
  // useEffect(scrollToBottom, [messages]);

  return (
    <ChatContainerStyled
      onClick={() => {
        setSettings({
          id,
          agentModel,
          systemPrompt,
          chatConstants,
          useProfileData,
          chatName,
        });
        console.log(`${chatName} clicked`);
      }}
    >
      <ChatBar
        chatName={chatName}
        id={id}
        idToken={idToken}
        setAgentArray={setAgentArray}
        setMessages={setMessages}
        backendUrl={backendUrl}
      />
      <MessagesContainer item xs={9}>
        <MessageArea>
          {messages.map((message, index) => {
            if (message) {
              if (message.message_from === "chatbot") {
                return <AgentMessage key={index} message={message} />;
              } else if (message.message_from === "user") {
                return <UserMessage key={index} message={message} />;
              }
            }
            return null; // return null when the message doesn't exist
          })}
          {streamingMessageParts.length > 0 && (
            <AgentMessage
              key={`agentMessage${id}`}
              message={streamingMessageParts}
            />
          )}
          <div ref={messagesEndRef} />
        </MessageArea>
        <MessageInput
          chatId={id}
          agentModel={agentModel}
          systemPrompt={systemPrompt}
          chatConstants={chatConstants}
          setMessages={setMessages}
        />
      </MessagesContainer>
    </ChatContainerStyled>
  );
};

export default Chat;
