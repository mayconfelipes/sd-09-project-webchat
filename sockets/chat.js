const moment = require('moment');
const ModelMessages = require('../models/ModelMessages');

const usersSockets = [];

const socketUpdateNickname = (io, { idSocket, newNick }) => {
  const userIndex = usersSockets.findIndex(({ id }) => id === idSocket);
  usersSockets[userIndex].nickname = newNick;
  io.emit('updateNickname', usersSockets);
};

const savedMessageDB = async (io, { nickname, chatMessage }) => {
  const timestamp = moment().format('DD-MM-yyyy LTS');
  const messageFormat = `${timestamp} - ${nickname}: ${chatMessage}`;
  await ModelMessages.create(messageFormat);
  io.emit('message', messageFormat);
};

// Com ajuda do meu amigo Yoneda! 
const socketDisconnect = (io, id) => {
  const userIndex = usersSockets.findIndex((user) => user.id === id);
  usersSockets.splice(userIndex, 1);
  io.emit('allUsers', usersSockets);
};

module.exports = (io) => io.on('connection', (socket) => {
  const id = socket.id.substring(0, 16);
  // const createUser = await ModelUsers.create(id);
  usersSockets.push({ id });

  socket.emit('userOn', id);

  socket.on('nickname', ({ id: idSocket, newNick }) => {
    const userIndex = usersSockets.findIndex((user) => user.id === idSocket);
    usersSockets[userIndex].nickname = newNick;
    io.emit('allUsers', usersSockets);
  });

  socket.on('updateNickname', ({ id: idSocket, newNick }) => {
    socketUpdateNickname(io, { idSocket, newNick });
  });

  socket.on('message', async ({ nickname, chatMessage }) => {
    await savedMessageDB(io, { nickname, chatMessage });
  });

  socket.on('disconnect', () => {
    socketDisconnect(io, id);
  });
});
