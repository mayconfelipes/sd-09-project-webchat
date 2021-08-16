const models = require('../models');

const homeView = async (_req, res) => {
  try {
    const { status, chat, message } = await models.chat.getAll();
    if (status !== 200) return res.status(status).json({ message });
    return res.render('index', { chat });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  homeView,
};
