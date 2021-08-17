const { result } = require('lodash');
const chatModel = require('../models/chatModel');

const addZero = (numero) => {
  if (numero <= 9) return `0${numero}`;
  return numero; 
};

const getTime = () => {
  const currentDate = new Date();
  const traco = '-';
  const hour = currentDate.getHours();
  const minute = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  const espaco = ' ';
  const doisPontos = ':';
  const currentDateFormated = addZero(currentDate.getDate().toString())
  + traco + addZero(currentDate.getMonth() + 1).toString()
  + traco + currentDate.getFullYear() 
  + espaco + hour + doisPontos + addZero(minute.toString())
  + doisPontos + addZero(seconds.toString()); 
  return currentDateFormated;
};

const createMessage = (chatMessage, nickName) => {
  const date = getTime();
  return {
    message: `${date} ${nickName} ${chatMessage}`,
    timestamp: date,
};
};

const iD = () => `_${Math.random().toString(36).substr(2, 9)}`;

module.exports = {
  createMessage,
  iD,
};

const saveUserOnDb = async (nickName) => {
  console.log(`${nickName} conectado`);
  const id = await chatModel.createUsers(nickName, 'online');
  return id;
};

const handleWithNewConnection = async (io, socket) => {
  const nickName = `userId${iD()}`;
  const id = await saveUserOnDb(nickName);
  const users = await chatModel.findUser();
  const messages = await chatModel.findMessages();
  socket.emit('userId', id, nickName, users);
  io.emit('refreshUsers', users);  
  io.emit('refreshMessages', messages);
};

const handleMessageEvent = async (io, chatMessage, nickname) => {
  const messageObj = createMessage(chatMessage, nickname);
  const { message, timestamp } = messageObj;
  const nickNameChat = nickname;
  await chatModel.createMessage(chatMessage, nickNameChat, timestamp);
  io.emit('message', message);
};

const handleChangeNickname = async (io, socket, userId, newNickname) => {
  await chatModel.updateUser(userId, newNickname);
  const users = await chatModel.findUser();
  io.emit('refreshUsers', users);
  socket.emit('userId', userId, newNickname, users);
};

const connectedClients = [];

// for (let index2 = 0; index2 < connectedClients.length; index2 += 1) {
//   if (_id.toString() !== connectedClients[index2].toString()) {
//     result.push(chatModel.deleteUser(userId));
//   }
// }
const handleWithDisconnectEvent = async (io, userId) => {
  console.log('aqui');
  // const users = await chatModel.findUser();
  connectedClients.push(userId);
  const results = [];
  for (let index = 0; index < connectedClients.length; index += 1) {
   
  }
  await Promise.all(results);
  connectedClients.length = 0;
};

module.exports = {
  handleWithNewConnection,
  handleChangeNickname,
  handleMessageEvent,
  handleWithDisconnectEvent,
};