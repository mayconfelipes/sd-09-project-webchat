const chatModel = require('../models/chatModel');

const insertMessage = async (dataMessage) => {
  await chatModel.insertMessage(dataMessage);
};

const getAllMessages = async (req, res) => {
  const allMessages = await chatModel.getAllMessages();
  return res.status(200).json(allMessages);
};

module.exports = {
  insertMessage,
  getAllMessages,
};
