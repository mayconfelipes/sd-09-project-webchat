const messages = require('../models/chat');

const getHistory = async (_req, res) => {
  const chatHistory = await messages.getHistory();
  return res.status(200).json(chatHistory);
};

module.exports = {
  getHistory,
};