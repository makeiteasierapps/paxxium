import { TextBlock, CodeBlock } from "../chat_container/AgentMessage";
import { highlightBlockCode } from "./codeHighLighter";

// Function to process messages from the database
export const processDatabaseMessage = async (message) => {
  let parts = [];
  let i = 0;
  let processedMessage = await highlightBlockCode(message);
  let message_content = processedMessage.message_content;

  while (message_content.includes("CODEBLOCK" + i)) {
    let splitMessage = message_content.split("CODEBLOCK" + i);
    parts.push({ type: "text", content: splitMessage[0] });

    if (
      processedMessage.codeBlocks &&
      processedMessage.codeBlocks["CODEBLOCK" + i]
    ) {
      parts.push({
        type: "code",
        content: processedMessage.codeBlocks["CODEBLOCK" + i],
      });
    }

    message_content = splitMessage[1] ? splitMessage[1] : "";
    i++;
  }

  if (message_content) {
    parts.push({ type: "text", content: message_content });
  }

  return parts;
};

// This function processes the stream of messages coming from the chat.
// It takes the previous message, the id of the current chat, and the token of the new message as parameters.
export const processStreamMessage = (prevMessage, id, token) => {
  // Get the last message from the previous messages.
  const lastMessage = prevMessage[id][prevMessage[id].length - 1];
  // If the last message was from the user, we simply append the new message to the end of the message array.
  if (lastMessage.message_from === "user") {
    return {
      ...prevMessage,
      [id]: [...prevMessage[id], token],
    };
  } else {
    // If the last message was not from the user, we append the new message content to the last message content.
    const newLastMessage = {
      ...lastMessage,
      message_content: lastMessage.message_content + token.message_content,
    };
    // Then we replace the last message with the new last message.
    return {
      ...prevMessage,
      [id]: [...prevMessage[id].slice(0, -1), newLastMessage],
    };
  }
};
