const crypto = require('crypto');

const chatModel = require('../models/modelMessages');

const users = {};

function createData() {
  const data = new Date();
  const formatedDate = (
    `${(data.getDate())}-${((data.getMonth() + 1))}-${data.getFullYear()}`
  );

  const formatedHour = (
    `${(data.getHours())}:${((data.getMinutes()))}:${data.getSeconds()}`
  );

  return `${formatedDate} ${formatedHour}`;
}
const fetchHistory = (socket, io) => {
  socket.on('FetchChatHistory', async () => {
    const randomNickName = crypto.randomBytes(8).toString('hex');
    users[socket.id] = randomNickName;
    const chatHistory = await chatModel.fetchMessageHistory();
    const arrayUsers = Object.values(users);
    socket.emit('FetchChatHistory', chatHistory);
    io.emit('onlineUsers', { arrayUsers, nickname: randomNickName });
  });
    socket.on('disconnect', () => {
    delete users[socket.id];
    const arrayUsers = Object.values(users);
    io.emit('onlineUsers', { arrayUsers, users });
  });
};

const sentMessage = (socket, io) => {
  socket.on('message', ({ chatMessage, nickname }) => {
    chatModel.postMessage({ message: chatMessage, nickname, timestamp: createData() });
    const message = `${createData()} - ${nickname}: ${chatMessage}`;
    io.emit('message', message);
  });
};

const changeNickname = (socket, io) => {
    socket.on('changeNick', (nickname) => {
    users[socket.id] = nickname;
    const arrayUsers = Object.values(users);
    io.emit('onlineUsers', { users, nickname, arrayUsers });
  });
};

module.exports = (io) => io.on('connection', (socket) => {
  fetchHistory(socket, io);
  changeNickname(socket, io);
  sentMessage(socket, io);
});