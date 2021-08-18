const moment = require('moment');
const ChatModels = require('../models/chatModels');

moment.defaultFormat = 'DD-MM-yyyy HH:mm:ss';

module.exports = (io) => io.on('connection', async (socket) => {
  const msg = await ChatModels.getMessages().then((data) => data
    .map(({ message, nickname, timestamp }) => `${timestamp} ${nickname} ${message}`));

  socket.emit('messages', msg);

  const timestamp = moment().format();

  socket.on('message', async ({ nickname, chatMessage }) => {
    const message = chatMessage;
    await ChatModels.createMessage({ message, nickname, timestamp });
    io.emit('message', `${timestamp} - ${nickname}: ${message}`);
  });
});
