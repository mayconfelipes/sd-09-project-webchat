const moment = require('moment'); 

const connectedUsers = {};

const webchat = (io) => {
  io.on('connection', (socket) => {
    connectedUsers[socket.id] = socket.id.substring(0, 16);
    io.emit('listUsers', Object.values(connectedUsers));

    socket.on('message', ({ chatMessage: message, nickname }) => {
      const timestamp = moment().format('DD-MM-yyyy HH:mm:ss A');
      io.emit('message', `${timestamp} - ${nickname}: ${message}`);
    });

    socket.on('nicknameChange', (newNickname) => {
      connectedUsers[socket.id] = newNickname;
      io.emit('listUsers', Object.values(connectedUsers));
    });

    socket.on('disconnect', () => {
      delete connectedUsers[socket.id];
      io.emit('listUsers', Object.values(connectedUsers));
    });
  });
};

module.exports = webchat;
