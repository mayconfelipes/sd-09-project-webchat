const moment = require('moment');
const { create, findAll } = require('../models/messageModel');

module.exports = (io) => io.on('connection', async (socket) => {
  socket.on('message', (data) => {
    const timestamp = moment().format('DD-MM-YYYY HH:mm:ss');
    const msg = `${timestamp} - ${data.nickname}: ${data.chatMessage}`;
    io.emit('message', msg);

    create({
      message: data.chatMessage,
      nickname: data.nickname,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
  });

  const messageList = await findAll();
  socket.emit('newConnection', messageList);
});
