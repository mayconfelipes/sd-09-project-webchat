const { randomBytes } = require('crypto');
const moment = require('moment');

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
      console.log(nickname);
      addUser(socket.id, nickname);
        io.emit('updateUsersList', users);
      });

    socket.on('message', ({ chatMessage, nickname = 'anonymous' }) => {
        const date = moment().format('DD-MM-yyyy HH:mm:ss');

        const message = `${date} - ${nickname}: ${chatMessage}`;
        io.emit('message', message);
      });

    socket.on('disconnect', async () => {
      delete users[socket.id];
      io.emit('updateUsersList', users);

      console.log(`User ${socket.id} disconnected`);
    });
  },
);