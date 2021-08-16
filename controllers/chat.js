const chatModel = require('../models/chat');

const chatView = async (_req, res) => {
  const { messages } = await chatModel.getAll();
  return res.render('chat', { messages });
};

module.exports = {
  chatView,
};