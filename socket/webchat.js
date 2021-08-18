const moment = require('moment');
const webchatModel = require('../models/webchat');

const onlineUsers = [];
const getTimestamp = moment().format('DD-MM-yyyy HH:mm:ss');

function ioWebchat(io) {
 io.on('connection', async (socket) => {
  const userId = socket.id.slice(0, 16);
  onlineUsers.push({ userId, nickname: userId });

  io.emit('connected', { nick: userId, users: onlineUsers });

  socket.on('updateNick', ({ newNick }) => {
    const user = onlineUsers.findIndex((u) => u.userId === userId);
    onlineUsers[user].nickname = newNick; io.emit('refreshUsers', { users: onlineUsers });
  });

  socket.on('message', async ({ chatMessage, nickname }) => {
    io.emit('message', `${getTimestamp} - ${nickname}: ${chatMessage}`);
    await webchatModel
    .addNewMessage({ message: chatMessage, nickname, timestamp: getTimestamp });
  });
      
  socket.on('disconnect', () => {
    const userIndex = onlineUsers.findIndex((u) => u.userId === userId);
    onlineUsers.splice(userIndex, 1); io.emit('disconnectUser', { users: onlineUsers });
  });
  });   
}

module.exports = ioWebchat;