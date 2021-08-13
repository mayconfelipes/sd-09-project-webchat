const {
  registerNewMessage,
  getAllMessages,
} = require('../models/webChatModel');

const onlineUsers = [];

const createDate = () => {
  const newDate = new Date().toLocaleString();
  const [date, time] = newDate.split(' ');
  const [day, month, year] = date.split('/');
  const correctDay = day.length === 1 ? `0${day}` : day;
  const correctMonth = month.length === 1 ? `0${month}` : month;
  const correctDate = `${correctDay}-${correctMonth}-${year}`;
  return `${correctDate} ${time}`;
};

const formatMessage = async (chatMessage, nickname) => {
  const newDate = createDate();
  await registerNewMessage({ message: chatMessage, nickname, timestamp: newDate });
  return `${newDate} - ${nickname}: ${chatMessage}`;
};

const startConnection = async (io, socket) => {
  const nickname = socket.id.slice(0, 16);
  onlineUsers.push({
    id: socket.id,
    nickname,
  });
  console.log(onlineUsers);
  const allMessages = await getAllMessages();
  socket.emit('oldMessages', allMessages);
  socket.emit('login', nickname);
  io.emit('sendAllUsers', onlineUsers);
};

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('login', () => startConnection(io, socket));

    socket.on('message', async ({ chatMessage, nickname }) => {
      const message = await formatMessage(chatMessage, nickname);
      io.emit('message', message);
    });

    socket.on('changeNickname', (newNickname) => {
      const chosenUser = onlineUsers.find((user) => user.id === socket.id);
      chosenUser.nickname = newNickname;
      io.emit('sendAllUsers', onlineUsers);
    });
  });
};