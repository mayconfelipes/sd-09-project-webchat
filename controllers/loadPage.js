const { getAll } = require("../models/messages");

const onlineUsers = [];

const loadPage = async (req, res) => {
  try {
    const messages = await getAll();

    res.status(200).render('index', { messages });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
}
module.exports = {
  loadPage,
  onlineUsers,
}