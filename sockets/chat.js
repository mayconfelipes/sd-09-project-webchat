const moment = require('moment');
const ModelUsers = require('../models/ModelUsers');
const ModelMessages = require('../models/ModelMessages');

const updateNicknameAndGetAllUsersDB = async (io, { idSocket, newNick }) => {
  await ModelUsers.updateNickname({ idSocket, nickname: newNick });
  const getAllUsers = await ModelUsers.getAllUsers();
  io.emit('allUsers', getAllUsers);
};

// const newUserDB = async (socket, io) => {
//   const id = socket.id.substring(0, 16);
//   const createUser = await ModelUsers.create(id);
//   io.emit('userOn', createUser);
// };

const savedMessageDB = async (io, { nickname, chatMessage }) => {
  const timestamp = moment().format('DD-MM-yyyy LTS');
  const messageFormat = `${timestamp} - ${nickname}: ${chatMessage}`;
  await ModelMessages.create(messageFormat);
  io.emit('message', messageFormat);
};

module.exports = (io) => io.on('connection', async (socket) => {
  const id = socket.id.substring(0, 16);
  const createUser = await ModelUsers.create(id);
  io.emit('userOn', createUser);

  socket.on('nickname', async ({ idSocket, newNick }) => {
    await updateNicknameAndGetAllUsersDB(io, { idSocket, newNick });
  });

  socket.on('updateNickname', async ({ idSocket, newNick }) => {
    await updateNicknameAndGetAllUsersDB(io, { idSocket, newNick });
  });

  // socket.on('updateNickname', async ({ idSocket, newNick }) => {
  //   await ModelUsers.updateNickname({ idSocket, nickname: newNick });
  //   const getAllUsers = await ModelUsers.getAllUsers();
  //   io.emit('updateNickname', getAllUsers);
  // });

  socket.on('message', async ({ nickname, chatMessage }) => {
    savedMessageDB(io, { nickname, chatMessage });
  });

  // socket.on('message', async ({ nickname, chatMessage }) => {
  //   const timestamp = moment().format('DD-MM-yyyy LTS');
  //   const messageFormat = `${timestamp} - ${nickname}: ${chatMessage}`;
  //   await ModelMessages.create(messageFormat);
  //   io.emit('message', messageFormat);
  // });

  socket.on('disconnect', async () => {
    await ModelUsers.deleteUser(createUser.idSocket);
    const getAllUsers = await ModelUsers.getAllUsers();
    io.emit('allUsers', getAllUsers);
  });
});