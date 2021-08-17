const moment = require('moment');
//  https://momentjs.com/
const WebChatModel = require('../models/webChatModel');

const onlineUsers = [];

function ioWebChat(io) {
  io.on('connection', (socket) => {
    // segundo parâmetro é uma callback com o parâmetro socket que é a
    // representação de uma conexão aberta ao socket-io rodando no back-end.
    // No objeto socket tem um atributo id que é uma string aleatória gerada a cada nova conexão.

    console.log(`connected user - ID: ${socket.id}`);
    const nick = socket.id.slice(0, 16);
    onlineUsers.push({ userID: socket.id, nickname: nick });

    io.emit('connected', nick);
    io.emit('onlineUsers', onlineUsers);

    socket.on('updateNick', ({ defaultNick, newNick }) => {
      // aqui a funcao recebe a informacao do emit e chama o model
      const user = onlineUsers.findIndex((u) => u.nickname === defaultNick);
      onlineUsers[user].nickname = newNick;
      io.emit('onlineUsers', onlineUsers);
    });

    socket.on('message', ({ chatMessage, nickname }) => {
      const timeStamp = moment().format('DD-MM-yyyy HH:mm:ss');
      io.emit('message', `${timeStamp} - ${nickname}: ${chatMessage}`);
      WebChatModel.addNewMessage({ message: chatMessage, nickname, timeStamp });
    });
  });
}

module.exports = ioWebChat;