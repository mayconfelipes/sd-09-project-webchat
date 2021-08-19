const saveMessage = async (message, webChatModel) => {
  await webChatModel.save(message);
};

const getMessageHistory = async (webChatModel) => {
  const messages = await webChatModel.getAll();

  return messages.map(({ message }) => {
    console.log(message);
    return message;
  });
};

const webChatController = (webChatModel) => ({
  saveMessage: (messageData) => saveMessage(messageData, webChatModel),
  getMessageHistory: () => getMessageHistory(webChatModel),
});

module.exports = webChatController;
