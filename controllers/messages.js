// const express = require('express');
const messagesModel = require('../models/messages');

const newMessage = async ({ chatMessage, nickname }, io) => {
  const timestamps = new Date().toLocaleString('pt-br').replace(/\//g, '-');
  const messageDocument = { nickname, chatMessage, timestamps };
  await messagesModel.create(messageDocument);
  io.emit('message', `${timestamps} - ${nickname}: ${chatMessage}`);
};

// const router = express.Router();

// router.get('/', async (_req, res, _next) => {
//   console.log('entrei aqui');
//   const messages = await messagesModel.getAll();
//   return res.status(200).json(messages);
// });

module.exports = {
  newMessage,
};