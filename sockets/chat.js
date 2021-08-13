const moment = require('moment');
const ModelUsers = require('../models/ModelUsers');
const ModelMessages = require('../models/ModelMessages');

module.exports = (io) => io.on('connection', async (socket) => {
  const id = socket.id.substring(0, 16);

  const createUser = await ModelUsers.create(id);

  socket.emit('userOn', createUser);
  socket.on('nickname', async ({ idSocket, newNick }) => {
    await ModelUsers.updateNickname({ idSocket, nickname: newNick });
  });

  socket.on('updateNickname', async ({ idSocket, newNick }) => {
    await ModelUsers.updateNickname({ idSocket, nickname: newNick });
    const getAllUsers = await ModelUsers.getAllUsers();
    socket.emit('updateNickname', getAllUsers);
  });

  socket.on('message', async ({ nickname, chatMessage }) => {
    const timestamp = moment().format('DD-MM-yyyy LTS');
    const messageFormat = `${timestamp} - ${nickname}: ${chatMessage}`;
    await ModelMessages.create(messageFormat);
    io.emit('message', messageFormat);
  });
});