const moment = require('moment');
const { saveMessage, getMessages } = require('../models/chat');

const currentTime = moment().format('DD-MM-yyyy HH:mm:ss');
let users = [];

const randomNickname = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const result = [];
  for (let index = 0; index < 16; index += 1) {
    result.push(letters[Math.floor(Math.random() * letters.length)]);
  }
  return result.join('');
};

const updateList = (io) => {
  const sendNickNames = users.map((user) => user.nickname);
  console.log(users, 'uuuu');
  io.emit('updateUserList', sendNickNames);
};

const startChat = async (socket, io) => {
  const messages = await getMessages();
  const userNick = randomNickname();
  users.push({ nickname: userNick, socket });

  const messageHistory = (messages).map(({ message, nickname, timestamp }) => (
    `${timestamp} - ${nickname}: ${message}`
    ));
  socket.emit('messageHistory', { messageHistory, nickname: userNick });

  updateList(io);
};

const updateUserNickname = (newNickname, socket, io) => {
  const findUser = users.find((user) => user.socket === socket);
  console.log(findUser);
  findUser.nickname = newNickname;
  updateList(io);
};

module.exports = (io) => io.on('connection', (socket) => {
  socket.emit('connection');
  startChat(socket, io);
  socket.on('message', async ({ chatMessage, nickname }) => {
    try {
      await saveMessage({ message: chatMessage, nickname, timestamp: currentTime });
    } catch (error) {
      console.log(error.message);
    }

    const resMessage = `${currentTime} - ${nickname}: ${chatMessage}`;
    io.emit('message', resMessage);
  });

  socket.on('disconnect', () => {
    users = users.filter((user) => user.socket !== socket);
    console.log(users);
    console.log('users');
    updateList(io);
  });

  socket.on('updateNickname', (newNickname) => updateUserNickname(newNickname, socket, io));
});