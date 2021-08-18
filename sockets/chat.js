const moment = require('moment');
const Messages = require('../models/chat');

moment.defaultFormat = 'DD-MM-YYYY HH:mm:ss';

// https://javascript.info/map-set#set
const userList = new Map();

module.exports = (io) => io.on('connection', async (socket) => {
  // https://tsh.io/blog/socket-io-tutorial-real-time-communication/
  const { id } = socket;
  const random = id.slice(0, -4);

  const messageList = await Messages.getAll();
  io.emit('restoreChat', messageList);
  
  socket.on('newUser', () => {
    userList.set(random, random);
    socket.broadcast.emit('newUser', [...userList]);
    socket.emit('online', [...userList]);
  });

  socket.on('changeName', (nickname) => {
    userList.set(random, nickname);
    io.emit('changeName', [...userList]);
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    Messages.create(chatMessage, userList.get(random) || random, moment().format());
    io.emit('message', `${moment()} ${nickname || userList.get(random)}: ${chatMessage}`);
  });

  socket.on('disconnect', () => { userList.delete(random); io.emit('offline', [...userList]); });
});
