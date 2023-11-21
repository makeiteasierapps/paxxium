export const sendMessage = (
  input,
  uid,
  addMessage,
  socketRef,
  idToken,
  chatId,
  agentModel
) => {
  // Optimistic update
  const userMessage = {
    message_content: input,
    message_from: "user",
    user_id: uid,
    time_stamp: new Date().toISOString(),
    type: "database",
  };

  addMessage(chatId, userMessage);

  // Emit the 'message' event to the server
  socketRef.current.emit("message", {
    idToken: idToken,
    chatId: chatId,
    message_content: input,
    message_from: "user",
    user_id: uid,
    agentModel: agentModel,
  });
};

export const keyDown = (
  event,
  input,
  uid,
  addMessage,
  socketRef,
  idToken,
  chatId,
  agentModel,
  setInput
) => {
  if (event.key === "Enter" && !event.shiftKey && input.trim() !== "") {
    sendMessage(input, uid, addMessage, socketRef, idToken, chatId, agentModel);
    setInput("");
  }
};
