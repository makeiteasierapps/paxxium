import { highlightStringCode } from "./CodeHighLighter";

export const processCodeBlockToken = async (
  token,
  refs,
  setStreamingMessageParts
) => {
  const {
    isCodeBlockRef,
    codeRef,
    langRef,
    tokenizedCodeRef,
    ignoreNextToken,
    isProcessing,
  } = refs;

  if (token.startsWith("``")) {
    ignoreNextToken.current = true;
  }

  if (isCodeBlockRef.current) {
    // End of a code block, reset variables for the next code block.
    const highlightedCode = highlightStringCode(
      codeRef.current,
      langRef.current
    );

    tokenizedCodeRef.current = highlightedCode
      .split(/(<[^>]*>)|\b/)
      .filter(Boolean);

    // Wait for all code parts to be processed before moving on
    for (let index = 0; index < tokenizedCodeRef.current.length; index++) {
      await new Promise((resolve) =>
        setTimeout(() => {
          setStreamingMessageParts((prevParts) => [
            ...prevParts,
            {
              type: "code",
              content: tokenizedCodeRef.current[index],
            },
          ]);
          resolve();
        }, 0)
      );
    }

    // Reset the variables and flag after the highlighting process is complete
    tokenizedCodeRef.current = [];
    isCodeBlockRef.current = false;
    langRef.current = "markdown";
    codeRef.current = "";
    isProcessing.current = false;
  } else {
    // Start of a code block.
    isProcessing.current = true;
    isCodeBlockRef.current = true;
  }
};

export const processTextToken = (token, refs, setStreamingMessageParts) => {
  const { isCodeBlockRef, codeRef, langRef, ignoreNextToken } = refs;

  if (isCodeBlockRef.current) {
    // Inside a code block.
    if (langRef.current) {
      // The first line of the code block may specify the language.
      langRef.current = token.trim() || "markdown";
      if (langRef.current === "jsx") {
        langRef.current = "javascript";
      }
      langRef.current = false;
    } else {
      // Add the token to the code block.
      codeRef.current += token;
    }
  } else {
    if (ignoreNextToken.current) {
      ignoreNextToken.current = false;
      return;
    }
    // This is a text token, add it to the streaming message parts.
    setStreamingMessageParts((prevParts) => {
      const updatedParts = [...prevParts];
      updatedParts.push({
        type: "text",
        content: token,
      });
      return updatedParts;
    });
  }
};

export const processToken = async (token, refs, setStreamingMessageParts) => {
  if (token.startsWith("```") || token.startsWith("``")) {
    await processCodeBlockToken(token, refs, setStreamingMessageParts);
  } else {
    processTextToken(token, refs, setStreamingMessageParts);
  }
  refs.isProcessing.current = false;
};


