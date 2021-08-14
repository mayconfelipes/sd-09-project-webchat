const { format } = require('date-fns');
const messagesModel = require('../models/messages');

const webChat = (io) => {
  io.on('connection', (socket) => {
    console.log(`Usuario ${socket.id} conectado.`);
  
    socket.on('nickname', (nickname) => {
      io.emit('nickname', nickname);
    });
    
    socket.on('message', ({ nickname, chatMessage }) => {
      const timestamp = format(new Date(), 'dd-MM-yyyy HH:mm:ss');
      messagesModel.updateHistory({ timestamp, nickname, message: chatMessage });
      io.emit('message', `${timestamp} - ${nickname}: ${chatMessage}`);
    });
    
    socket.on('disconnect', () => {
      console.log(`Usuario ${socket.id} desconectou`);
    });
  });
};

module.exports = webChat;
