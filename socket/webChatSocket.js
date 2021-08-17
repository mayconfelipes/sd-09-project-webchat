const moment = require('moment');
//  https://momentjs.com/
const webChatModel = require('../models/webChatModel');

const onlineUsers = [];
const getTimestamp = moment().format('DD-MM-yyyy HH:mm:ss');

function ioWebChat(io) {
  io.on('connection', async (socket) => {
    // segundo parâmetro é uma callback com o parâmetro socket que é a
    // representação de uma conexão aberta ao socket-io rodando no back-end.
    // No objeto socket tem um atributo id que é uma string aleatória gerada a cada nova conexão.

    onlineUsers.push({ userId: socket.id.slice(0, 16), nickname: socket.id.slice(0, 16) });

    io.emit('connected', { userId: socket.id.slice(0, 16) });

    io.emit('onlineUsers', onlineUsers);

    socket.on('updateNick', ({ defaultNick, newNick }) => {
      // aqui a funcao recebe a informacao do emit e chama o model
      const user = onlineUsers.findIndex((u) => u.nickname === defaultNick);
      onlineUsers[user].nickname = newNick;
      io.emit('onlineUsers', onlineUsers);
    });

    socket.on('message', async ({ chatMessage, nickname }) => {
      io.emit('message', `${getTimestamp} - ${nickname}: ${chatMessage}`);
      await webChatModel.addNewMessage({ message: chatMessage, nickname, timestamp: getTimestamp });
    });
  });
}

module.exports = ioWebChat;