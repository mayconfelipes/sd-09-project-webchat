const { format } = require('date-fns');
const messagesModel = require('../models/messages');

let usersList = [];
const timestamp = format(new Date(), 'dd-MM-yyyy HH:mm:ss');

const webChat = (io) => io.on('connection', (socket) => {
  socket.on('create user', (nickname) => {
    io.emit('append user', { id: socket.id, nickname });
    usersList.push({ id: socket.id, nickname });
    socket.emit('get user list', usersList.filter((user) => user.id !== socket.id));
  });

  socket.on('message', ({ nickname, chatMessage }) => {
    messagesModel.updateHistory({ timestamp, nickname, message: chatMessage });
    io.emit('message', `${timestamp} - ${nickname}: ${chatMessage}`);
  });

  socket.on('update nickname', (nickname) => {
    usersList.find((user) => user.id === socket.id).nickname = nickname;
    io.emit('update nickname', { id: socket.id, nickname });
  });

  socket.on('disconnect', () => {
    const userToBeRemoved = usersList.find((user) => user.id === socket.id);
    usersList = usersList.filter((user) => user.id !== socket.id);
    io.emit('remove user', userToBeRemoved);
  });
});

module.exports = webChat;
