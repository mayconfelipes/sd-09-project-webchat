// const chatModel = require('../models/chatModel');
const { format } = require('date-fns');

const time = format(new Date(), 'dd-MM-yyyy HH:mm:ss');

let users = [];

const ioChat = (io) => {
  io.on('connection', (socket) => {
    socket.on('login', (nickname) => {
      users = users.filter((user) => user.id !== socket.id);
      users.push({ nickname, id: socket.id });
      io.emit('users', users);
    });

    socket.on('disconnect', () => {
      users = users.filter((user) => user.id !== socket.id);
      io.emit('users', users);
    });

    socket.on('message', ({ chatMessage, nickname }) => {
      io.emit('message', `${time} - ${nickname}: ${chatMessage}`);
    });
  });
};

module.exports = ioChat;