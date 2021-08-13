const moment = require('moment');
const ModelUsers = require('../models/ModelUsers');

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

  socket.on('message', ({ nickname, chatMessage }) => {
    const timestamp = moment().format('DD-MM-yyyy LTS');
    const messageFormat = `${timestamp} - ${nickname}: ${chatMessage}`;

    io.emit('message', messageFormat);
  });
});