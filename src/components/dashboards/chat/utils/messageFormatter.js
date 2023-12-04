import Prism from 'prismjs';
import 'prismjs/components/prism-javascript.min';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-typescript';
import 'prismjs/themes/prism-okaidia.css';

export const formatBlockMessage = (message) => {
    const codeblock = /```(\S*)?\s([\s\S]*?)```/g;
    let parts = [];
    let match;
    let lastIndex = 0;

    while ((match = codeblock.exec(message.message_content)) !== null) {
        let lang = match[1] || 'markdown'; // set to markdown if no language is specified
        const code = match[2].trim();

        if (lang === 'jsx') {
            lang = 'javascript';
        }

        const highlightedCode = Prism.highlight(
            code,
            Prism.languages[lang] || Prism.languages.plaintext,
            lang
        );

        // Add the text before the code block to the parts array.
        if (match.index > lastIndex) {
            parts.push({
                type: 'text',
                content: message.message_content.substring(
                    lastIndex,
                    match.index
                ),
            });
        }

        // Add the highlighted code block to the parts array.
        parts.push({
            type: 'code',
            content: highlightedCode,
            language: lang,
        });

        lastIndex = codeblock.lastIndex;
    }

    // If there's any remaining message content, add it to the parts array.
    if (lastIndex < message.message_content.length) {
        parts.push({
            type: 'text',
            content: message.message_content.substring(lastIndex),
        });
    }

    return parts;
};

export const formatStreamMessage = (message, insideCodeBlock) => {
    const parts = [];
    if (insideCodeBlock) {
        parts.push({
            type: 'code',
            content: message.message_content,
            language: 'bash',
        });
    } else {
        parts.push({
            type: 'text',
            content: message.message_content,
        });
    }

    return parts;
};
