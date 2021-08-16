const moment = require('moment');
const Models = require('../models/chat');
const Users = require('./users');

const format = 'DD-MM-yyyy HH:mm:ss';

const getAllMessages = async () => {
  const messageList = await Models.getAll();
  return messageList;
};

const messageSocket = (socket, io) => (socket.on('message', async ({ chatMessage, nickname }) => {
  const message = `${moment().format(format)} - ${nickname}: ${chatMessage}`;
  
  await Models.setMessage({ message, nickname, timestamp: moment().format(format) });

  io.emit('message', message);
}));

const connect = (io) => {
  let usersOnline = [];
  io.on('connect', async (socket) => {
    socket.emit('messageList', await getAllMessages());
    
    socket.on('setOnline', (nickname) => {
      usersOnline = Users.setUser(nickname, socket.id, usersOnline);
      io.emit('usersOnline', usersOnline);
    });

    socket.on('changeNickname', ({ newNickname, _nickname }) => {
      usersOnline = Users.changeUser(newNickname, socket.id, usersOnline);
      io.emit('usersOnline', usersOnline);
    });

    messageSocket(socket, io);

    socket.on('disconnect', () => {
      usersOnline = Users.deleteUser(socket.id, usersOnline);
      io.emit('usersOnline', usersOnline);
    });
  });
};

module.exports = connect;
