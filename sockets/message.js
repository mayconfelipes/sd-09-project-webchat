const models = require('../models');
const formatMessage = require('../services/formatMessage');
const onlineUsers = require('../users');

const login = (io, socket) => {
  const initialNickname = socket.id.substring(0, 16);
  onlineUsers.push({ id: socket.id, nickname: initialNickname });
  socket.emit('myNickname', initialNickname);
  io.emit('usersList', onlineUsers);
};

const updateMessages = async (chatMessage, nickname) => {
  const message = formatMessage(chatMessage, nickname);
  await models.insertNewMessage(message);
  return message;
};

module.exports = (io) => io.on('connection', (socket) => {
  socket.on('initialize', () => login(io, socket));
  
  socket.on('message', async ({ chatMessage, nickname }) => {
    const message = await updateMessages(chatMessage, nickname);
    io.emit('message', message);
  });

  socket.on('editNickname', async (nickname) => {
    const oldUser = onlineUsers.find((user) => user.id === socket.id);
    oldUser.nickname = nickname;
    io.emit('usersList', onlineUsers);
  });

  socket.on('disconnect', () => {
    const logOutUser = onlineUsers.indexOf(socket.id);
    onlineUsers.splice(logOutUser, 1);
    io.emit('usersList', onlineUsers);
  });
});
