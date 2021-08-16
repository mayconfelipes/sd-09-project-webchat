const moment = require('moment');
const chatModel = require('../models/chat');

let connectedUsers = [];

const createUser = (socket) => ({
  nickname: (socket.id).split('').splice(0, 16).join(''),
  id: socket.id,
  namedNick: null,
});

const connect = (io) => io.on('connection', (socket) => {
  const user = createUser(socket);
  io.emit('connection', { user, connectedUsers, socketId: socket.id });

  connectedUsers.push(user);

  socket.on('newNick', ({ nickname, socketId }) => {
    user.namedNick = nickname;
    io.emit('newNick', { nickname, socketId });
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    const date = moment().format('DD-MM-YYYY hh:mm:ss A');
    io.emit('message', `${date} - ${nickname}: ${chatMessage}`);
    chatModel.addMessage({ message: chatMessage, nickname, timestamp: date });
  });

  socket.on('disconnect', () => {
    const userToRemove = connectedUsers.find(({ id }) => id === socket.id);
    connectedUsers = connectedUsers.filter(({ id }) => id !== socket.id);
    io.emit('userDisconnect', userToRemove);
  });
});

module.exports = {
  connect,
};
