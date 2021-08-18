const moment = require('moment');
const { create, findAll } = require('../models/messageModel');

let userList = [];

const saveMessage = (message) => {
  const { chatMessage, nickname } = message;
  create({
    message: chatMessage,
    nickname,
    timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
  });
};

const prepareMessage = (message) => {
  const { nickname, chatMessage } = message;
  const timestamp = moment().format('DD-MM-YYYY HH:mm:ss');
  const msg = `${timestamp} - ${nickname}: ${chatMessage}`;
  const messageObj = { timestamp, ...message };
  return { messageObj, msg };
};

const addNickname = (io, socket) => {
  socket.on('addNickname', (newUser) => {
    userList.push(newUser);
    io.emit('updateUserList', userList);
  });
};

const updateNickname = (io, socket) => {
  socket.on('updateNickname', ({ id, userName }) => {
    const foundUser = userList.find((user) => user.id === id);
    foundUser.userName = userName;
    const newUserList = userList.filter((user) => user.id !== id);
    newUserList.push(foundUser);
    userList = newUserList;
    io.emit('updateUserList', userList);
  });
};

const removeNickname = (socket) => {
  socket.on('disconnect', () => {
    const newArray = userList.filter((user) => user.id !== socket.id);
    userList = newArray;
    socket.broadcast.emit('updateUserList', userList);
  });
};

const sendMessage = (io, socket) => {
  socket.on('message', (message) => {
    const { msg, messageObj } = prepareMessage(message);
    io.emit('message', msg);
    saveMessage(messageObj);
  });
};

const getMessageList = async (socket) => {
  const messageList = await findAll();
  socket.emit('getMessageList', messageList);
};

module.exports = (io) => io.on('connection', (socket) => {
  socket.emit('connection');
  addNickname(io, socket);
  updateNickname(io, socket);
  removeNickname(socket);
  sendMessage(io, socket);
  getMessageList(socket);
});
