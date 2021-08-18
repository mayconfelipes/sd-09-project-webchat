const moment = require('moment');

const users = {};

module.exports = (io) => io.on('connection', (socket) => {
  socket.on('initialList', () => {
    const newNickname = socket.id.slice(0, 16);
    users[socket.id] = newNickname;
    io.emit('userlist', { users, newNickname });
  });

  socket.on('message', async ({ chatMessage: message, nickname }) => {
    const timestamp = moment().format('DD-MM-yyyy LTS');
    io.emit('message', `${timestamp} ${nickname} ${message}`);
  });

  socket.on('savenickname', (nickname) => {
    users[socket.id] = nickname;
    io.emit('userlist', { users, newNickname: nickname });
  });
});