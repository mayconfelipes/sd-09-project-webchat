const usersList = {};
const crypto = require('crypto');
const { saveLogMessage, getAllMessages } = require('../models/chatmodel');

const createDate = () => {
  const date = new Date();
  const day = date.getDate();
  const month = (date.getMonth() + 1);
  const yaer = date.getFullYear();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const fullDate = `${day}-${month}-${yaer} ${hour}:${minutes}:${seconds}`;
  return fullDate;
};

const sendInitialUsersList = (socket) => {
  socket.emit('onlineUser', usersList);
};

const sendUsersList = (socket, io) => {
  socket.on('newUser', (newUser) => {
    usersList[socket.id] = newUser;
    socket.emit('updateName', usersList[socket.id]);
    io.emit('updateUsers', usersList);
  });
};

const removeUser = (socket, io) => {
  socket.on('disconnect', () => {
    delete usersList[socket.id];
    io.emit('updateUsers', usersList);
  });
};

const sendNewMessage = (socket, io) => {
  socket.on('message', ({ chatMessage, nickname }) => {
    saveLogMessage(chatMessage, nickname, createDate());
    const message = `${createDate()} - ${nickname}: ${chatMessage}`;
    io.emit('message', (message));
  });
};

const setInitailUser = (socket, io) => {
  socket.on('userStart', async () => {
    usersList[socket.id] = crypto.randomBytes(20).toString('hex').substr(0, 16);
    socket.emit('updateName', usersList[socket.id]);
    const messagesLog = await getAllMessages();
    socket.emit('printChatLog', messagesLog);
    io.emit('updateUsers', usersList);
  });
};

module.exports = (io) => io.on('connection', (socket) => {
  sendInitialUsersList(socket);
  sendUsersList(socket, io);
  removeUser(socket, io);
  sendNewMessage(socket, io);
  setInitailUser(socket, io);
});
