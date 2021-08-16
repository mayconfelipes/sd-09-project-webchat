const crypto = require('crypto');
const messagesModel = require('../models/messages');

module.exports = (io) => io.on('connection', async (socket) => {
  const firstNick = crypto.randomBytes(8).toString('hex');
  socket.emit('myNickname', firstNick);
  socket.broadcast.emit('nickname', { nickname: firstNick, id: socket.id });

  socket.on('message', async ({ chatMessage, nickname }) => {
    const timestamps = new Date().toLocaleString('pt-br').replace(/\//g, '-');
    const messageFormated = `${timestamps} - ${nickname}: ${chatMessage}`;
    const messageDocument = { nickname, chatMessage, timestamps };
    await messagesModel.create(messageDocument);
    io.emit('message', messageFormated);
  });

  socket.on('nickname', (nickname) => {
    socket.emit('myNickname', nickname);
    socket.broadcast.emit('nickname', { nickname, id: socket.id });
  });

  const messages = await messagesModel.getAll();
  socket.emit('getMessages', { messages, id: socket.id });
});