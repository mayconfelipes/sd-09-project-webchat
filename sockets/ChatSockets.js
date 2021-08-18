const moment = require('moment');
const messageModel = require('../models/ChatModel');

let sockets = [];

const addNewUserSocket = (nickname, socket) => {
  const user = { nickname, socket };

  sockets.push(user);

  return user;
};

const online = (io) => { 
  io.emit('onlineUser', 
  sockets.map(({ nickname }) => nickname));
};

const changeUserNick = (io, nickname, socket) => {
  sockets.forEach((el) => {
    const newUserSocket = el;

    if (el.socket === socket) {
      newUserSocket.nickname = nickname;
    }
  });

  online(io);
};

const disconnectUserSocket = (io, socket) => {
  sockets = sockets
  .filter(
    (user) => user.socket.id !== socket.id,
    );

  online(io);
};

module.exports = (io) => 

io.on('connection', async (socket) => {
  const { nickname: userNick } = socket.handshake.query;

  addNewUserSocket(userNick, socket);

  socket.on('message', async ({ chatMessage, nickname }) => {
    const Now = moment().format('DD-MM-yyyy HH:mm:ss');

    await messageModel.createNewMsg(
      { message: chatMessage, nickname, timestamp: Now },
    );

    io.emit('message', `${Now} - ${nickname}: ${chatMessage}`);
  });

  const chatHistory = (
    await messageModel.getAllMsgs())
    .map(({ message, nickname, timestamp }) => (`${timestamp} ${nickname} ${message}`));

  socket.emit('chatHistory', chatHistory);

  socket.on('changeUserNick', (newNick) => 
    changeUserNick(io, newNick, socket));

  socket.on('disconnect', () => disconnectUserSocket(io, socket));

  online(io);
});