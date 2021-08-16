const { randomBytes } = require('crypto');
const moment = require('moment');

const Message = require('../models/Message');

const users = {};

const addUser = (id, nickname) => {
  if (!nickname) {
    const randomNickname = randomBytes(8).toString('hex');
    users[id] = randomNickname;
  } else {
    users[id] = nickname;
  }
};

module.exports = (io) => io.on(
  'connection',
  async (socket) => {
    socket.on('updateUsersList', (nickname = '') => {
        addUser(socket.id, nickname);
        io.emit('updateUsersList', users);
      });

    socket.on('message', async ({ chatMessage, nickname = 'anonymous' }) => {
        const timestamp = moment().format('DD-MM-yyyy HH:mm:ss');

        const message = new Message({ message: chatMessage, nickname, timestamp });
        message.create();

        const formatedMessage = `${timestamp} - ${nickname}: ${chatMessage}`;
        io.emit('message', formatedMessage);
      });

    socket.on('disconnect', async () => {
      delete users[socket.id];
      io.emit('updateUsersList', users);
    });
  },
);