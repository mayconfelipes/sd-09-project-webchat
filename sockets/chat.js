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
  });
};

const editName = ({ socket, io, nickName: userId }) => {
  socket.on('editName', (newName) => {
    io.emit('editName', ({ newName, userId }));
  
    const arrayIndex = arr.findIndex((user) => user.nameId === userId);
 
    arr[arrayIndex].nickName = newName;
 
    io.emit('allUsers', arr);
  });
};

const getAllUser = async (socket) => {
  const messages = await chatContRoller.getAllMessages();
    socket.emit('previousMessage', messages);
};
const chatIo = (io) => {
  io.on('connection', (socket) => {
    const nickName = randomstring.generate(16);
    arr.push({ nickName, nameId: nickName });

    socket.emit('randomNickName', JSON.stringify(nickName));
    getAllUser(socket);
    allUsers(socket, io);

    editName({ socket, io, nickName });

    socket.on('message', async (data) => {
      const chatMessages = await chatContRoller.postChatMessages(dateFormat(data, socket));
      io.emit('message', JSON.stringify(chatMessages));
    });

    onDisconnection(socket, io, nickName);
  });
};

module.exports = chatIo;