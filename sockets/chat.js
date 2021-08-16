const moment = require('moment');
const ModelUsers = require('../models/ModelUsers');
const ModelMessages = require('../models/ModelMessages');

const socketUpdateNickname = async (io, { idSocket, newNick }) => {
  await ModelUsers.updateNickname({ idSocket, nickname: newNick });
  const getAllUsers = await ModelUsers.getAllUsers();
  io.emit('updateNickname', getAllUsers);
};

const savedMessageDB = async (io, { nickname, chatMessage }) => {
  const timestamp = moment().format('DD-MM-yyyy LTS');
  const messageFormat = `${timestamp} - ${nickname}: ${chatMessage}`;
  await ModelMessages.create(messageFormat);
  io.emit('message', messageFormat);
};

const socketDisconnect = async (io) => {
  const getAllUsers = await ModelUsers.getAllUsers();
  io.emit('allUsers', getAllUsers);
};

module.exports = (io) => io.on('connection', async (socket) => {
  const id = socket.id.substring(0, 16);

  const createUser = await ModelUsers.create(id);

  socket.emit('userOn', createUser);
  socket.on('nickname', async ({ idSocket, newNick }) => {
    await ModelUsers.updateNickname({ idSocket, nickname: newNick });
    const getAllUsers = await ModelUsers.getAllUsers();
    io.emit('allUsers', getAllUsers);
  });

  socket.on('updateNickname', async ({ idSocket, newNick }) => {
    socketUpdateNickname(io, { idSocket, newNick });
  });

  socket.on('message', async ({ nickname, chatMessage }) => {
    savedMessageDB(io, { nickname, chatMessage });
  });

  socket.on('disconnect', async () => {
    await ModelUsers.deleteUser(createUser.idSocket);
    await socketDisconnect(io);
  });
});
