const moment = require('moment');
const { getAll, save } = require('../models/messages');

let users = [];

const allNicknames = () => users.map((user) => user.nickname);
const updateList = (io) => io.emit('updateList', allNicknames());
const findUser = (socket) => users.find((user) => user.socket === socket);
const removeUser = (socket) => {
  users = users.filter((user) => user.socket !== socket);
};

const createUser = async (socket) => {
  const newUser = { socket, nickname: socket.id.slice(0, 16).toString() };
  users.push(newUser);
  return newUser;
};

const getMessageFormatedList = async () => {
  const messageList = await getAll();
  const messageFormatedList = messageList.map(({ timestamp, nickname, message }) => (
    `${timestamp} - ${nickname}: ${message}`
  ));
  return messageFormatedList;
};

const chat = (io) => {
  io.on('connection', async (socket) => {
    socket.emit('messageList', await getMessageFormatedList());
    createUser(socket);

    socket.on('nickname', (nickname) => {
      const userFound = findUser(socket);
      if (userFound) userFound.nickname = nickname;
      updateList(io);
    });

    updateList(io);

    socket.on('message', async ({ nickname, chatMessage }) => {
      const timestamp = moment().format('DD-MM-yyyy LTS');
      const message = `${timestamp} - ${nickname}: ${chatMessage}`;
      await save({ chatMessage, nickname, timestamp });
      io.emit('message', message);
    });

    socket.on('disconnect', () => { removeUser(socket); updateList(io); });
  });
};

module.exports = { chat };
