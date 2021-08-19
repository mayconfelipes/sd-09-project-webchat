const moment = require('moment');
const io = require('./socket');
const MessageModel = require('../models/MessageModel');

let users = [];

const addUser = (socket) => {
  const newUser = { nickname: socket.id.slice(0, 16), socket };
  users.push(newUser);
  return newUser;
};

const updateUsers = () => {
  const userNicknames = users.map(({ nickname }) => nickname);
  io.emit('updateUsers', userNicknames);
};

const formatMessage = ({ timestamp, nickname, message }) => (
  `${timestamp} - ${nickname}: ${message}`
);

const message = async ({ chatMessage, nickname }) => {
  const timestamp = moment().format('DD-MM-yyyy HH:mm:ss');
  await MessageModel.create({ message: chatMessage, nickname, timestamp });
  const formattedMessage = formatMessage({ timestamp, nickname, message: chatMessage });
  console.log(formattedMessage);
  io.emit('message', formattedMessage);
};

const disconnect = (socket) => {
  users = users.filter((currentUser) => currentUser.socket !== socket);
  updateUsers();
};

const changeNickname = (newNickname, socket) => {
  const user = users.find((currentUser) => currentUser.socket === socket);
  user.nickname = newNickname;
  updateUsers();
};

const init = async (socket) => {
  const newUser = addUser(socket);
  await MessageModel.findAll().then((history) => {
    const formattedHistory = history.map((current) => formatMessage(current));
    socket.emit('init', { nickname: newUser.nickname, history: formattedHistory });
  });
  updateUsers();
};

io.on('connect', (socket) => {
  console.log(`Client ${socket.id} connected.`);

  init(socket);
  socket.on('message', (payload) => message(payload));
  socket.on('disconnect', () => disconnect(socket));
  socket.on('changeNickname', (newNickname) => changeNickname(newNickname, socket));
});
