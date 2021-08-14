const messages = require('../models/messages');

const getAll = async (req, res) => {
  const chatMessages = await messages.getAll();
  return res.status(200).json(chatMessages);
};

module.exports = {
  getAll,
};
