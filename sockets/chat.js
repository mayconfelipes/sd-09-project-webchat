const moment = require('moment');
const Message = require('../models/messages');

const users = {};

module.exports = (io) => io.on('connection', async (socket) => {
  const messages = await Message.getAll().then((arr) => arr
    .map(({ message, nickname, timestamp }) => `${timestamp} ${nickname} ${message}`));

  users[socket.id] = socket.id.slice(0, 16);

  socket.emit('newConnection', { userId: users[socket.id], messages });

  socket.on('message', async ({ chatMessage: message, nickname }) => {
    const timestamp = moment().format('DD-MM-yyyy LTS');
    await Message.create({ message, nickname, timestamp });
    io.emit('message', `${timestamp} ${nickname} ${message}`);
  });
});
