const moment = require('moment');
const webChatModel = require('../models/webChatModel');

const connectedUsers = [];

const trimSocketId = (socketId) => socketId.slice(0, 16);

// modificar
const disconnectUser = (socketId, io) => {
  // await webChatModel.disconnectUser(socketId);
  const userIndex = connectedUsers.findIndex((user) => user.id === trimSocketId(socketId));
  connectedUsers.splice(userIndex, 1);
  io.emit('usersList', (connectedUsers));
};

const getUserList = (socketId, io) => {
  connectedUsers.push({ id: trimSocketId(socketId) });
  io.emit('usersList', (connectedUsers));
};

const changeNickname = (newNickname, socketId, socket, io) => {
  const userIndex = connectedUsers.findIndex((user) => user.id === trimSocketId(socketId));
  connectedUsers[userIndex].nickname = newNickname;
  socket.emit('newNickname', (newNickname));
  io.emit('usersList', (connectedUsers));
};

const saveMessage = ({ message, nickname, io }) => {
  const messageTimeStamp = moment().format('DD-MM-yyyy LTS');
  const formattedMessage = `${messageTimeStamp} - ${nickname} > ${message}`;
  webChatModel.saveMessage({ message, nickname, messageTimeStamp });
  io.emit('message', (formattedMessage));
};

const getSavedMessages = async () => {
  const messages = await webChatModel.getSavedMessages();

  const formattedMessages = messages.map(({ message, nickname, messageTimeStamp }) =>
    `${messageTimeStamp} - ${nickname} > ${message}`);
  return formattedMessages;
};

connectedUsers.pop();

module.exports = {
  disconnectUser,
  changeNickname,
  saveMessage,
  getSavedMessages,
  getUserList,
  connectedUsers,
};
