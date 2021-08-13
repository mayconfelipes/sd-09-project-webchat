const Message = require('../models/Message');

const getMessages = async (_req, res) => {
  const messages = await Message.getAll();
  return res.status(200).json(messages);
};

module.exports = {
  getMessages,
};