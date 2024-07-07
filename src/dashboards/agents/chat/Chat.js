import { memo, useContext, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChatContext } from './ChatContext';
import AgentMessage from './components/AgentMessage';
import ChatSettings from './components/ChatSettings';
import ChatBar from './components/ChatBar';
import MessageInput from './components/MessageInput';
import UserMessage from './components/UserMessage';
import {
    MessagesContainer,
    MessageArea,
    ChatContainerStyled,
} from '../agentStyledComponents';

const Chat = ({
    agent: {
        chatId,
        chat_constants: chatConstants,
        system_prompt: systemPrompt,
        chat_name: chatName,
        agent_model: agentModel,
        use_profile_data: useProfileData,
        project_id: projectId,
    },
    setIsChatOpen = null,
}) => {
    const nodeRef = useRef(null);
    const { messages, socket } = useContext(ChatContext);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    console.log(messages[chatId]);

    useEffect(() => {
        if (socket.current) {
            socket.current.emit('join_room', { chatId: chatId });
        }
    }, [socket, chatId]);

    // scrolls chat window to the bottom
    useEffect(() => {
        const node = nodeRef.current;
        node.scroll(0, node.scrollHeight);
    }, [messages]);

    const chatSettings = {
        chatName,
        chatId,
        agentModel,
        systemPrompt,
        chatConstants,
        useProfileData,
        projectId,
    };

    return (
        <ChatContainerStyled>
            <ChatBar
                chatName={chatName}
                chatId={chatId}
                isSettingsOpen={isSettingsOpen}
                setIsSettingsOpen={setIsSettingsOpen}
                setIsChatOpen={setIsChatOpen}
            />
            <MessagesContainer xs={9} id="messages-container">
                <MessageArea ref={nodeRef}>
                    {messages[chatId]?.map((message, index) => {
                        if (message.message_from === 'user') {
                            return (
                                <UserMessage
                                    key={`user${index}`}
                                    message={message}
                                />
                            );
                        }
                        return (
                            <AgentMessage
                                key={`stream${index}`}
                                message={message}
                            />
                        );
                    })}
                </MessageArea>
                <MessageInput chatSettings={chatSettings} />
            </MessagesContainer>
            <AnimatePresence>
                {isSettingsOpen ? (
                    <ChatSettings
                        chatId={chatId}
                        chatConstants={chatConstants}
                        systemPrompt={systemPrompt}
                        chatName={chatName}
                        agentModel={agentModel}
                        useProfileData={useProfileData}
                        setIsSettingsOpen={setIsSettingsOpen}
                        isSettingsOpen={isSettingsOpen}
                    />
                ) : null}
            </AnimatePresence>
        </ChatContainerStyled>
    );
};

export default memo(Chat);
