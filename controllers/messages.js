const messagesModel = require('../models/messages');

const getHistory = async (_req, res) => {
  const messagesHistory = await messagesModel.getAll();

  return res.status(200).render('webchat', { messagesHistory });
};

module.exports = {
  getHistory,
};
