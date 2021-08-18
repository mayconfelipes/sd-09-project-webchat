const chatMessages = require('../models/chatMessages');

const listMessages = async (_req, res) => {
  const messages = await chatMessages.getAllMessages();

  res.render('chat', { messages });
};

module.exports = {
  listMessages,
};
