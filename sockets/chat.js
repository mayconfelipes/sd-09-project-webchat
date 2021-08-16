const crypto = require('crypto');
const messagesModel = require('../models/messages');

const users = {};

const sendMessage = async ({ nickname, chatMessage }, io) => {
  const timestamps = new Date().toLocaleString('pt-br').replace(/\//g, '-');
  const messageDocument = { nickname, chatMessage, timestamps };
  await messagesModel.create(messageDocument);
  io.emit('message', `${timestamps} - ${nickname}: ${chatMessage}`);
};

const updateUser = (io, socket, newNick) => {
  socket.emit('myNickname', newNick);
  users[socket.id] = newNick;
  io.emit('newNickname', { users, id: socket.id });
};

const dropUser = (io, id) => {
  delete users[id];
  io.emit('newNickname', { users });
};

module.exports = (io) => io.on('connection', async (socket) => {
  const firstNick = crypto.randomBytes(8).toString('hex');
  socket.emit('myNickname', firstNick);

  users[socket.id] = firstNick;

  io.emit('newNickname', { users, id: socket.id });

  socket.on('message', async ({ chatMessage, nickname }) => {
    await sendMessage({ chatMessage, nickname }, io);
  });

  socket.on('nickname', (newNickname) => {
    updateUser(io, socket, newNickname);
  });

  socket.on('disconnect', () => {
    dropUser(io, socket.id);
  });

  const messages = await messagesModel.getAll();
  socket.emit('getMessages', { messages, id: socket.id });
});
