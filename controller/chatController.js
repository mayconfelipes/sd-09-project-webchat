const chatModel = require('../models/chatModel');

const getAll = async () => chatModel.getMessages();

const saveMessage = async (chatMessage, nickname, timestamp) => {
  await chatModel.saveMessage(chatMessage, nickname, timestamp);
};

module.exports = {
  getAll,
  saveMessage,
};
