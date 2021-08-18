const moment = require('moment');
const chatModel = require('../models/chatModel');

const onlineClientsId = {};

const changeUserWhenDisconnect = (socket, io) => {
  delete onlineClientsId[socket.id];
  io.emit('usersConnectedId', Object.values(onlineClientsId));
};

const changeNicknameFromOnlineUser = (nickname, socket, io) => {
  onlineClientsId[socket.id] = nickname;
  io.emit('usersConnectedId', Object.values(onlineClientsId));
};

const createAndSaveMessages = async ({ chatMessage, nickname }, io) => {
  const date = moment().format('DD-MM-yyyy LTS');
  // const timestampDB = moment().format('yyyy-MM-DD LTS');
  const formatedMsg = `${date} - ${nickname}: ${chatMessage}`;

  await chatModel.createMessageDB(chatMessage, nickname, date);

  io.emit('message', formatedMsg);
};

module.exports = (io) => io.on('connection', async (socket) => {
  const randomNick = socket.id.slice(0, 16);
  onlineClientsId[socket.id] = randomNick;

  io.emit('usersConnectedId', Object.values(onlineClientsId));

  socket.on('disconnect', () => changeUserWhenDisconnect(socket, io));

  socket.on('nickname', (nickname) => changeNicknameFromOnlineUser(nickname, socket, io));
  
  socket.on('message', async ({ chatMessage, nickname }) => {
    createAndSaveMessages({ chatMessage, nickname }, io);
  });

  socket.emit('sort', 'up');
  // socket.broadcast.emit('sort', 'up');

  const historyMessages = await chatModel.getAllMessagesDB();
  io.emit('historyMessages', historyMessages);
});