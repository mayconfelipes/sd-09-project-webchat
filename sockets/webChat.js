const moment = require('moment');
const chatController = require('../controller/chatController');

const connectedUsers = {};

module.exports = (io) => io.on('connection', async (socket) => {
  const chatHistory = await chatController.getAll().then((msgs) => msgs
    .map(({ timestamp, nickname, message }) => `${timestamp} - ${nickname}: ${message}`));

  socket.emit('newConnection', chatHistory);
  connectedUsers[socket.id] = socket.id.substring(0, 16);
  io.emit('updateOnlineUsers', Object.values(connectedUsers));

  socket.on('disconnect', () => {
    delete connectedUsers[socket.id];
    io.emit('updateOnlineUsers', Object.values(connectedUsers));
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    const newMessage = `${moment().format('DD-MM-yyyy HH:mm:ss A')} - ${nickname}: ${chatMessage}`;
    io.emit('message', newMessage);
    chatController.saveMessage(chatMessage, nickname, moment().format('DD-MM-yyyy HH:mm:ss A'));
  });
  
  socket.on('nickname', (user) => {
    connectedUsers[socket.id] = user;
    io.emit('updateOnlineUsers', Object.values(connectedUsers));
  });
});
