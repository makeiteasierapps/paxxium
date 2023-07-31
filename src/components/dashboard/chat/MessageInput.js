import React, {
    useContext,
    useState,
    useEffect,
    useRef,
    useCallback,
} from 'react';
import Prism from 'prismjs';
import io from 'socket.io-client';
import 'prismjs/components/prism-javascript.min';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-okaidia.css';
import { ChatContext } from '../../../contexts/ChatContext';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/system';
import { AuthContext } from '../../../contexts/AuthContext';
import { highlightStringCode } from '../../../utils/messageParser';

const backendUrl = process.env.REACT_APP_BACKEND_URL;
// Connect to the server
const socket = io.connect(backendUrl);

const InputArea = styled('div')({
    padding: '20px',
    display: 'flex',
    alignItems: 'center', // Vertically center children
    justifyContent: 'space-between',
});

const MessageInput = () => {
    const {
        selectedAgentId,
        selectedAgentName,
        uid,
        conversationId,
        setMessages,

    } = useContext(ChatContext);
    const { idToken } = useContext(AuthContext);
    const [input, setInput] = useState('');
    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const sendMessage = () => {
        // Optomistic update
        const userMessage = {
            message_content: input,
            message_from: 'user',
            user_id: uid,
            agent_id: selectedAgentId,
            time_stamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput(''); // clear the input field

        // Emit the 'message' event to the server
        socket.emit('message', {
            idToken: idToken,
            conversationId: conversationId,
            message_content: input,
            message_from: 'user',
            user_id: uid,
            agent_id: selectedAgentId,
            agent_name: selectedAgentName,
        });

        // Listen for 'message' event from the server
        socket.on('message', (data) => {
            // setMessages((prevMessages) => {
            //   const updatedMessages = [...prevMessages];
            //   updatedMessages.push(data);
            //   return updatedMessages;
            // });
        });
    };

    const queueRef = useRef([]);
    const isProcessingRef = useRef(false);
    const isStreamActiveRef = useRef(false);
    const isCodeBlockRef = useRef(false);
    const codeRef = useRef('');
    const langRef = useRef('markdown');
    const isLangLineRef = useRef(false);
    const tokenizedCodeRef = useRef([]);
    const ignoreNextToken = useRef(false);

    // Define the processQueue function using useCallback to avoid unnecessary re-creations.
    const processQueue = useCallback(
        async (newQueue) => {
            // If the newQueue is empty, deactivate the stream and return.
            if (newQueue.length === 0) {
                isStreamActiveRef.current = false;
                if (isProcessingRef.current) {
                    isProcessingRef.current = false;
                }
                return;
            }

            // If already processing, return to avoid concurrent processing.
            if (isProcessingRef.current) {
                return;
            }

            // Set the processing flag to true to avoid concurrent processing.
            isProcessingRef.current = true;

            // Extract the first token from the queue and handle any consecutive empty strings.
            let [token, ...remainingQueue] = newQueue;
            while (token === '' && remainingQueue.length > 0) {
                [token, ...remainingQueue] = remainingQueue;
            }

            // Check if the token marks the start or end of a code block.
            if (token.startsWith('```') || token.startsWith('``')) {
                if (isCodeBlockRef.current) {
                    token = '';
                    // End of a code block, reset variables for the next code block.
                    const highlightedCode = await highlightStringCode(
                        codeRef.current,
                        langRef.current
                    );
                    tokenizedCodeRef.current = highlightedCode
                        .split(/(<[^>]*>)|\b/)
                        .filter(Boolean);
                    setMessages((prevMessages) => {
                        const updatedMessages = [...prevMessages];
                        console.log(updatedMessages);
                        // Loop through each element of tokenizedCode and add it to the last element of updatedMessages
                        for (
                            let i = 0;
                            i < tokenizedCodeRef.current.length;
                            i++
                        ) {
                            updatedMessages[updatedMessages.length - 1] +=
                                tokenizedCodeRef.current[i];
                        }
                        tokenizedCodeRef.current = [];
                        isCodeBlockRef.current = false;
                        langRef.current = 'markdown';
                        codeRef.current = ''; // Clear the tokenizedCode array
                        return updatedMessages;
                    });
                } else {
                    // Start of a code block.
                    isCodeBlockRef.current = true;
                    isLangLineRef.current = true;
                }
            } else if (isCodeBlockRef.current) {
                // Inside a code block.
                if (isLangLineRef.current) {
                    // The first line of the code block may specify the language.
                    langRef.current = token.trim() || 'markdown';
                    if (langRef.current === 'jsx') {
                        langRef.current = 'javascript';
                    }
                    isLangLineRef.current = false;
                } else {
                    // Add the token to the code block.
                    codeRef.current += token;
                }
            }

            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages];
                const lastMessage = updatedMessages[updatedMessages.length - 1];

                if (!isCodeBlockRef.current) {
                    if (typeof lastMessage === 'string') {
                        updatedMessages[updatedMessages.length - 1] += token;
                    } else {
                        updatedMessages.push(token);
                    }
                }

                return updatedMessages;
            });

            // Reset the processing flag to allow the next token processing.
            isProcessingRef.current = false;
            // Update the queue with the remaining tokens.
            queueRef.current = remainingQueue;
        },
        [setMessages] // Dependencies of the processQueue function.
    );

    // Set up an effect to listen to incoming tokens and process them using the processQueue function.
    useEffect(() => {
        const handleToken = (token) => {
            // Add the incoming token to the queue and process the queue.
            queueRef.current = [...queueRef.current, token];
            processQueue(queueRef.current);
        };

        // Register the event listener for incoming tokens.
        socket.on('token', handleToken);

        // Clean up by removing the event listener when the component is unmounted.
        return () => {
            socket.off('token', handleToken);
        };
    }, [processQueue]); // Run this effect whenever the processQueue function changes.

    // Set up an effect to call the processQueue function on the initial component mount.
    useEffect(() => {
        processQueue(queueRef.current);
    }, [processQueue]); // Run this effect whenever the processQueue function changes.

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && input.trim() !== '') {
            sendMessage();
        }
    };

    return (
        <InputArea>
            <TextField
                id="outlined-basic-email"
                label="Type Something"
                fullWidth
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                color="primary"
                                aria-label="send message"
                                onClick={sendMessage}
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
