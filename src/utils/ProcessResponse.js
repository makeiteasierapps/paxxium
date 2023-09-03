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

export const highlightBlockCode = async (message) => {
    const regex = /```(\S*)?\s([\s\S]*?)```/g;
    let match;
    let highlightedStr = message.message_content;

    let count = 0;
    while ((match = regex.exec(message.message_content)) !== null) {
        let lang = match[1];
        const code = match[2].trim();

        // set to markdown if no language is specified
        if (!lang) {
            lang = 'markdown';
        }

        if (lang === 'jsx') {
            lang = 'javascript';
        }

        const highlightedCode = Prism.highlight(
            code,
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

export const highlightStringCode = (code, lang) => {
    const highlightedCode = Prism.highlight(
        code,
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
