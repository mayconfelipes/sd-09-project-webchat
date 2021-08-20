const moment = require('moment');
const ChatModels = require('../models/chatModels');

moment.defaultFormat = 'DD-MM-yyyy HH:mm:ss';

let users = [];

const sendUserList = (socket, io) => {
  socket.on('userNickname', (nickname) => {
    users.push(nickname);
    io.emit('users', users);
  });
};

const createMessage = async (io, socket, timestamp) => {
  socket.on('message', async ({ nickname, chatMessage }) => {
    const message = chatMessage;
    await ChatModels.createMessage({ message, nickname, timestamp });
    io.emit('message', `${timestamp} - ${nickname}: ${message}`);
  });
};

const getAllMessages = async () => ChatModels.getMessages().then((data) => data
.map(({ message, nickname, timestamp }) => `${timestamp} ${nickname} ${message}`));

module.exports = (io) => io.on('connection', async (socket) => {
  const timestamp = moment().format();

  createMessage(io, socket, timestamp);

  const messagesList = await getAllMessages();

  let user = '';
  user = socket.id.slice(0, 16);

  socket.emit('messages', messagesList);

  sendUserList(socket, io);

  socket.emit('userConnected', user);

  socket.on('updateNickname', (nickname) => {
    users = users.map((el) => (el === user ? nickname : el));
    user = nickname;
    io.emit('users', users);
  });

  socket.on('disconnect', () => {
    users = users.filter((el) => el !== user);
    io.emit('users', users);
  });
});
