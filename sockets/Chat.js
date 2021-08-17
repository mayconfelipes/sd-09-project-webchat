const moment = require('moment');
const { saveMessages, getMessages } = require('../models/Chat');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Usuário conectado. ID: ${socket.id} `);

    socket.on('message', ({ chatMessage, nickname }) => {
      const timestamp = moment().format('DD-MM-YYYY hh:mm:ss');
      io.emit('message', `${timestamp} - ${nickname}: ${chatMessage}`);
      saveMessages({
        message: chatMessage,
        nickname,
        timestamp,
      });
    });

    socket.on('onload', async () => {
      const messages = await getMessages();
  
      messages.forEach(({ message, nickname, timestamp }) => {
        io.emit('message', `${timestamp} - ${nickname}: ${message}`);
      });
    });
  });
};
