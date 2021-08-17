const moment = require('moment');
//  https://momentjs.com/
const WebChatModel = require('../models/webChatModel');

// const onlineUsers = [];

function ioWebChat(io) {
  io.on('connection', (socket) => {
    // socket indentifica o quem realizou o emit

    socket.on('message', async ({ chatMessage, nickname }) => {
      // aqui a funcao recebe a informacao do emit e chama o model
      const timeStamp = moment().format('DD-MM-yyyy HH:mm:ss');
      await WebChatModel.addNewMessage({ message: chatMessage, nickname, timeStamp });
      io.emit('message', `${timeStamp} - ${nickname}: ${chatMessage}`);
    });
  });
}

module.exports = ioWebChat;