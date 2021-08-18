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
    const userId = socket.id.slice(0, 16);
    onlineUsers.push({ userId, nickname: userId });

    io.emit('connected', { nick: socket.id.slice(0, 16), users: onlineUsers });

    socket.on('updateNick', ({ newNick }) => {
      // aqui a funcao recebe a informacao do emit e chama o model
      const user = onlineUsers.findIndex((u) => u.nickname === userId);
      onlineUsers[user].nickname = newNick;
      io.emit('updateNick', { nick: newNick, users: onlineUsers });
    });

    socket.on('message', async ({ chatMessage, nickname }) => {
      io.emit('message', `${getTimestamp} - ${nickname}: ${chatMessage}`);
      await webChatModel.addNewMessage({ message: chatMessage, nickname, timestamp: getTimestamp });
    });

    socket.on('disconnect', () => {
    const userIndex = onlineUsers.findIndex((u) => u.userId === userId);
    onlineUsers.splice(userIndex, 1); io.emit('disconnectUser', onlineUsers);
    });
  });
}

module.exports = ioWebChat;