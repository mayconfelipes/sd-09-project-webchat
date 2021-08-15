const { Router } = require('express');
const ChatModel = require('../models/chat');

const chatRoutes = Router();

chatRoutes.get('/', async (_req, res) => {
  const messages = await ChatModel.getMessages();

  return res.status(200).render('chat/index', { messages });
});

module.exports = chatRoutes;
