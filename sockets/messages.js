const models = require('../models');

const messages = (io) => {
  io.on('connection', (socket) => {
    socket.on('message', async ({ chatMessage, nickname }) => {
      const date = new Date();
      const formatedDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
      const formatedHour = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      const timestamp = `${formatedDate} ${formatedHour}`;
      await models.chat.postMessage(chatMessage, nickname, timestamp);
      io.emit('message', `${formatedDate} ${formatedHour} - ${nickname}: ${chatMessage}`);
    });

    socket.on('newConnection', (nickname) => {
      io.emit('newConnection', nickname);
    });

    socket.on('updateNickname', ({ oldNickname, newNickname }) => {
      io.emit('updateNickname', { oldNickname, newNickname });
    });
  });
};

module.exports = messages;