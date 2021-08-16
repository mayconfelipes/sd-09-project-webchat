const randomstring = require('randomstring');
const chatContRoller = require('../controller/chat');

const date = new Date();
const dateFormat = ({ nickname, chatMessage }, socket) => {
  const formDate = `${date.toLocaleDateString().replace(/\//g, '-')} ${date.toLocaleTimeString()}`;
  return {
    userId: socket.id,
    formDate,
    nickname, 
    chatMessage,
  };
};

const arr = [];

const onDisconnection = (socket, io, nickName) => {
  socket.on('disconnect', () => {
    const arrayIndex = arr.indexOf(nickName);
    arr.splice(arrayIndex, 1);
    io.emit('disconnection', nickName);
  });
};

const allUsers = (socket, io) => {
  socket.on('allUsers', () => {
    io.emit('allUsers', arr);
    console.log('all', arr);
  });
};

const editName = (socket, io, nickName) => {
  socket.on('editName', (newName) => {
    io.emit('editName', ({ newName, nickName }));
    const arrayIndex = arr.indexOf(nickName);
    arr.splice(arrayIndex, 1, newName);
  });
};
const chatIo = (io) => {
  io.on('connection', async (socket) => {
    const nickName = randomstring.generate(16);
    arr.push(nickName);
    console.log('push', nickName);

    const messages = await chatContRoller.getAllMessages();
    socket.emit('previousMessage', messages);

    socket.emit('randomNickName', JSON.stringify(nickName));

    allUsers(socket, io);

    editName(socket, io, nickName);

    socket.on('message', async (data) => {
      const chatMessages = await chatContRoller.postChatMessages(dateFormat(data, socket));
      io.emit('message', JSON.stringify(chatMessages));
    });

    onDisconnection(socket, io, nickName);
  });
};

module.exports = chatIo;