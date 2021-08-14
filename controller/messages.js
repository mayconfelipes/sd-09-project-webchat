const { io } = require('socket.io-client');

const sendMessage = (req, res, _next) => {
  io.emit('notification', req.body);
  res.status(200).json({ message: 'Notícia adicionada' });
};

module.exports = {
  sendMessage,
};