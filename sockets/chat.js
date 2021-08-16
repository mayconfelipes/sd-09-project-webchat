const moment = require('moment');
const chatModel = require('../models/chatModel');

module.exports = (io) => io.on('connection', async (socket) => {
  const randoNickname = socket.id.slice(0, 16);
  const onlineUsers = [];
  onlineUsers.push({ id: socket.id, randoNickname });

  // socket.on('disconnect', );

  io.emit('usersConnected', onlineUsers);

  const historyMessages = await chatModel.getAllMessagesDB();
  io.emit('historyMessages', historyMessages);
  
  socket.on('message', async ({ chatMessage, nickname }) => {
    const date = moment().format('DD-MM-yyyy LTS');
    // const timestampDB = moment().format('yyyy-MM-DD LTS');
    const formatedMsg = `${date} - ${nickname}: ${chatMessage}`;

    await chatModel.createMessageDB(chatMessage, nickname, date);

    io.emit('message', formatedMsg);
  });
});