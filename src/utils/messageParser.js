import Prism from 'prismjs';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/plugins/babel';
import estreeParser from 'prettier/plugins/estree';
import postcss from 'prettier/plugins/postcss';
import htmlParser from 'prettier/plugins/html'
import yamlParser from 'prettier/plugins/yaml'
import markdownParser from 'prettier/plugins/markdown'
import 'prismjs/components/prism-javascript.min';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-typescript';
import 'prismjs/themes/prism-okaidia.css';

// map languages to their corresponding prettier plugins
const languageToParserMap = {
    css: {parser: "css", plugins: [postcss]},
    html: {parser: "html", plugins: [htmlParser]},
    json: {parser: "json", plugins: [parserBabel, estreeParser]},
    yaml: {parser: "yaml", plugins: [yamlParser]},
    markdown: {parser: "markdown", plugins: [markdownParser]},
    default: {parser: "babel", plugins: [parserBabel, estreeParser]}
};

const highlightCode = async (message) => {
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

        // fetch the prettier configuration for the language
        const prettierConfig = languageToParserMap[lang] || languageToParserMap.default;

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
        message.codeBlocks['CODEBLOCK' + count] = '<pre><code class="language-' + lang + '">' + highlightedCode + '</code></pre>';
        count++;
    }
    message.message_content = highlightedStr;
    return message;
};

export default highlightCode;
