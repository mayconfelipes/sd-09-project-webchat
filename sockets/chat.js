const moment = require('moment');

const messages = [];
const users = {};

module.exports = (io) => io.on('connection', (socket) => {
  users[socket.id] = socket.id.slice(0, 16);

  socket.emit('newConnection', { userId: users[socket.id], messages });

  socket.on('message', ({ chatMessage: message, nickname }) => {
    const timestamp = moment().format('DD-MM-yyyy LTS');
    messages.push({ message, nickname, timestamp });
    io.emit('message', `${timestamp} ${nickname} ${message}`);
  });
});
