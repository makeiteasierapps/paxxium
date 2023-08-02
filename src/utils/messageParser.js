import Prism from 'prismjs';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/plugins/babel';
import estreeParser from 'prettier/plugins/estree';
import postcss from 'prettier/plugins/postcss';
import htmlParser from 'prettier/plugins/html';
import yamlParser from 'prettier/plugins/yaml';
import markdownParser from 'prettier/plugins/markdown';
import 'prismjs/components/prism-javascript.min';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-typescript';
import 'prismjs/themes/prism-okaidia.css';
import { useEffect, useRef, useCallback, useContext } from "react";
import io from 'socket.io-client';
import { ChatContext } from '../contexts/ChatContext';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

// map languages to their corresponding prettier plugins
const languageToParserMap = {
    css: { parser: 'css', plugins: [postcss] },
    html: { parser: 'html', plugins: [htmlParser] },
    json: { parser: 'json', plugins: [parserBabel, estreeParser] },
    yaml: { parser: 'yaml', plugins: [yamlParser] },
    markdown: { parser: 'markdown', plugins: [markdownParser] },
    javascript: { parser: 'babel', plugins: [parserBabel, estreeParser] },
};

const highlightBlockCode = async (message) => {
    const regex = /```(\S*)?\s([\s\S]*?)```/g;
    let match;
    let highlightedStr = message.message_content;

    let count = 0;
    while ((match = regex.exec(message.message_content)) !== null) {
        let lang = match[1];
        const code = match[2].trim();
        let formattedCode;

        // set to markdown if no language is specified
        if (!lang) {
            lang = 'markdown';
        }

        if (lang === 'jsx') {
            lang = 'javascript';
        }

        // fetch the prettier configuration for the language
        const prettierConfig =
            languageToParserMap[lang] || languageToParserMap.default;

        if (lang === 'python' || !languageToParserMap[lang]) {
            formattedCode = code; // if no parser is found or language is python, leave code as it is
        } else {
            formattedCode = await prettier.format(code, prettierConfig);
        }

        const highlightedCode = Prism.highlight(
            formattedCode,
            Prism.languages[lang] || Prism.languages.plaintext, // if Prism does not have a highlighter for the language, default to plaintext
            lang
        );
        highlightedStr = highlightedStr.replace(
            match[0],
            'CODEBLOCK' + count // unique identifier for each code block
        );
        message.codeBlocks = message.codeBlocks || {};
        message.codeBlocks['CODEBLOCK' + count] =
            '<pre><code class="language-' +
            lang +
            '">' +
            highlightedCode +
            '</code></pre>';
        count++;
    }
    message.message_content = await highlightedStr;
    return message;
};

const highlightStringCode = async (code, lang) => {
    // Format and highlight the code as it comes in
    let formattedCode;
    if (lang === 'python' || !languageToParserMap[lang]) {
        formattedCode = code; // if no parser is found or language is python, leave code as it is
    } else {
        const prettierConfig =
            languageToParserMap[lang] || languageToParserMap.default;
        formattedCode = await prettier.format(code, prettierConfig);
    }

    const highlightedCode = Prism.highlight(
        formattedCode,
        Prism.languages[lang] || Prism.languages.plaintext, // if Prism does not have a highlighter for the language, default to plaintext
        lang
    );

    return (
        '<pre><code class="language-' +
        lang +
        '">' +
        highlightedCode +
        '</code></pre>'
    );
};

const ProcessResponse = () => {
        // Define the processQueue function using useCallback to avoid unnecessary re-creations.
        const queueRef = useRef([]);
        const isProcessingRef = useRef(false);
        const isStreamActiveRef = useRef(false);
        const isCodeBlockRef = useRef(false);
        const codeRef = useRef('');
        const langRef = useRef('markdown');
        const isLangLineRef = useRef(false);
        const tokenizedCodeRef = useRef([]);
        const ignoreNextToken = useRef(false);
        const {setMessages} = useContext(ChatContext)

        const socketRef = useRef(null);
        // Set up the socket connection on mount and disconnect on unmount.
        useEffect(() => {
            socketRef.current = io.connect(backendUrl);
    
            return () => {
                socketRef.current.disconnect();
            };
        }, []);
        
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
            socketRef.current.on('token', handleToken);
    
            // Clean up by removing the event listener when the component is unmounted.
            return () => {
                socketRef.current.off('token', handleToken);
            };
        }, [processQueue]); // Run this effect whenever the processQueue function changes.
    
        // Set up an effect to call the processQueue function on the initial component mount.
        useEffect(() => {
            processQueue(queueRef.current);
        }, [processQueue]); // Run this effect whenever the processQueue function changes.
};

export default ProcessResponse;
export { highlightBlockCode, highlightStringCode };
