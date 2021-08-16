const { createMessage, iD } = require('./message');
const chatModel = require('../models/chatModel');

const sentMessage = async (io) => {
  io.on('connection', async (socket) => {
    const nickName = `userId${iD()}`;
    console.log(`${nickName} conectado`);
    const id = await chatModel.createUsers(nickName, 'online');
    const users = await chatModel.findUser();
    socket.emit('userId', id, users);
    io.emit('refreshUsers', users);  
    socket.on('message', async ({ chatMessage, nickname }) => {
      const messageObj = createMessage(chatMessage, nickname);
      const { message, timestamp } = messageObj;
      await chatModel.createMessage(chatMessage, nickName, timestamp);
      io.emit('message', message);
    });
  });
  io.on('end', (_socket) => {
    console.log('client desconectado');
  });
};

module.exports = sentMessage;