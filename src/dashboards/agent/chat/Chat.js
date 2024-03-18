import { memo, useContext, useEffect, useRef } from 'react';
import { ChatContext } from '../../../dashboards/agent/chat/ChatContext';
import { formatBlockMessage } from '../utils/messageFormatter';
import AgentMessage from './components/AgentMessage';
import Settings from '../Settings';
import ChatBar from './components/ChatBar';
import MessageInput from './components/MessageInput';
import UserMessage from './components/UserMessage';
import {
    MessagesContainer,
    MessageArea,
    ChatContainerStyled,
    SettingsMenuContainer,
} from '../agentStyledComponents';

const Chat = ({
    chatId,
    chatConstants,
    systemPrompt,
    chatName,
    agentModel,
    useProfileData,
}) => {
    const nodeRef = useRef(null);
    const { messages, loadMessages, settingsOpen } = useContext(ChatContext);

    // Fetch messages from the database
    useEffect(() => {
        loadMessages(chatId);
    }, [chatId, loadMessages]);

    // scrolls chat window to the bottom
    useEffect(() => {
        const node = nodeRef.current;
        node.scroll(0, node.scrollHeight);
    }, [messages]);

    return (
        <ChatContainerStyled>
            <ChatBar chatName={chatName} chatId={chatId} />
            <MessagesContainer xs={9} id="messages-container">
                <MessageArea ref={nodeRef}>
                    {messages[chatId]?.map((message, index) => {
                        let formattedMessage = message;
                        if (message.type === 'database') {
                            if (message.message_from === 'agent') {
                                formattedMessage = formatBlockMessage(message);
                                return (
                                    <AgentMessage
                                        key={`agent${index}`}
                                        message={formattedMessage}
                                        id={chatId}
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
                    chatId={chatId}
                    agentModel={agentModel}
                    systemPrompt={systemPrompt}
                    chatConstants={chatConstants}
                    useProfileData={useProfileData}
                />
            </MessagesContainer>
            {settingsOpen && (
                <SettingsMenuContainer id="settings-container">
                    <Settings />
                </SettingsMenuContainer>
            )}
        </ChatContainerStyled>
    );
};

export default memo(Chat);
