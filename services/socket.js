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

// const saveUserOnDb = async (nickName, socketId) => {
//   console.log(`${nickName} conectado`);
//   const id = await chatModel.createUsers(nickName, 'online', socketId);
//   return id;
// };

const users = [];

const handleWithNewConnection = async (io, socket) => {
  try {
    //  when a new connection started get the nickname, create the user using nickname and socket id
    // get all users and message and sent to all clients connecteds
    const nickName = `userId${iD()}`;
    // const id = await saveUserOnDb(nickName, socket.id);
    //  const users = await chatModel.findUser();
    users.push({ id: socket.id, nickname: nickName, status: 'online' });
    const messages = await chatModel.findMessages();
    socket.emit('userId', { id: socket.id, nickname: nickName, users });
    socket.broadcast.emit('refreshUsers', users);  
    io.emit('refreshMessages', messages);
  } catch (e) {
    console.log(e.message);
  }
};

const handleMessageEvent = async (io, chatMessage, nickname) => {
  // when arrive a new message get all messages and sent to all clients connecteds
  const messageObj = createMessage(chatMessage, nickname);
  const { message, timestamp } = messageObj;
  const nickNameChat = nickname;
  await chatModel.createMessage(chatMessage, nickNameChat, timestamp);
  io.emit('message', message);
};

const handleChangeNickname = async (io, socket, userObj) => {
  //  when a user wants to change nickname, update the nickname on db, update te nickname on the messages
  // that is on db sent the messages updated to all clientes as the new user nickname
  const { userId, newNickname } = userObj;
  //  await chatModel.updateUser(userId, newNickname);
  //  await chatModel.updateMessages(userNickname, newNickname);
  //  const users = await chatModel.findUser();
  //  const messages = await chatModel.findMessages();
  const index = users.findIndex((user) => user.id === userId);
  users[index].nickname = newNickname;
  socket.emit('userId', { id: userId, nickname: newNickname, users });
  socket.broadcast.emit('refreshUsers', users);
  //  io.emit('refreshMessages', messages);
};

const handleWithDisconnectEvent = async (socketId, io) => {
  //  when a user disconnect delete the user using the socket id
  //  await chatModel.deleteUser(socketId);
  //  const users = await chatModel.findUser();
  const index = users.findIndex((user) => user.id === socketId);
  users.splice(index, 1);
  io.emit('refreshUsers', users);
};

module.exports = {
  handleWithNewConnection,
  handleChangeNickname,
  handleMessageEvent,
  handleWithDisconnectEvent,
};