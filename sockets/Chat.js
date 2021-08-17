const moment = require('moment');
const { saveMessages, getMessages } = require('../models/Chat');

const usersData = {
  ids: [],
  users: [],
};

const sendMessage = (chatMessage, nickname, io) => {
  const timestamp = moment().format('DD-MM-YYYY hh:mm:ss');
  saveMessages({ message: chatMessage, nickname, timestamp });
  io.emit('message', `${timestamp} - ${nickname}: ${chatMessage}`);
};

const getMessage = async (io) => {
  const messages = await getMessages();
  messages.forEach(({ message, nickname, timestamp }) => {
    io.emit('message', `${timestamp} - ${nickname}: ${message}`);
  });
};

const addOnlineUser = (user, id, io) => {
  usersData.users.push(user);
  usersData.ids.push(id);
  io.emit('loadUsers', usersData.users);
};

const updateUser = (newNickname, oldNickname, io) => {
  usersData.users[usersData.users.indexOf(oldNickname)] = newNickname;
  io.emit('loadUsers', usersData.users);
};

const removeOnlineUser = (id, io) => {
  usersData.users.splice(usersData.ids.indexOf(id), 1);
  usersData.ids.splice(usersData.ids.indexOf(id), 1);
  io.emit('loadUsers', usersData.users);
};

module.exports = (io) => {
    io.on('connection', (socket) => {
    socket.on('message', ({ chatMessage, nickname }) => {
      sendMessage(chatMessage, nickname, io);
    });
    socket.on('loadMessages', () => {
      getMessage(io);
    });
    socket.on('loadUsers', (user) => {
      addOnlineUser(user, socket.id, io);
    });
    socket.on('changeNickname', ({ newNickname, oldNickname }) => {
      updateUser(newNickname, oldNickname, io);
    });
    socket.on('disconnect', () => {
      removeOnlineUser(socket.id, io);
    });
  }); 
};
