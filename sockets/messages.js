const models = require('../models');

const connections = [];

const newMessage = async (socket, io, chatMessage, nickname) => {
  const date = new Date();
  const formatedDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
  const formatedHour = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  const timestamp = `${formatedDate} ${formatedHour}`;
  await models.chat.postMessage(chatMessage, nickname, timestamp);
  io.emit('message', `${formatedDate} ${formatedHour} - ${nickname}: ${chatMessage}`);
};

const connect = (socket, io, nickname) => {
  const socketId = socket.id;
  connections.push({ nickname, socketId });
  io.emit('newConnection', connections);
};

const messages = (io) => {
  io.on('connection', (socket) => {
    socket.on('message', async ({ chatMessage, nickname }) => 
      newMessage(socket, io, chatMessage, nickname));

    socket.on('newConnection', (nickname) => connect(socket, io, nickname));

    socket.on('updateNickname', ({ oldNickname, newNickname }) => {
      const index = connections.findIndex((conn) => conn.nickname === oldNickname);
      connections[index].nickname = newNickname;
      io.emit('updateNickname', connections);
    });

    socket.on('disconnect', (_reason) => {
      const index = connections.findIndex((conn) => conn.socketId === socket.id);
      connections.splice(index, 1);
      io.emit('updateNickname', connections);
    });
  });
};

module.exports = {
  messages,
  connections,
};