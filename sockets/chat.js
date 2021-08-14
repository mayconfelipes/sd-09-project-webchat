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

const chatIo = (io) => {
  io.on('connection', async (socket) => {
    console.log(`Socket conectado com id: ${socket.id}`);
    const messages = await chatContRoller.getAllMessages();

    socket.emit('previousMessage', messages);
  
    socket.emit('randomNickName', randomstring.generate(16));

    socket.on('editNickName', async (data) => {
      console.log(data);
      // const updateUser = await chatContRoller.updateChatUser(dateFormat(data));
      const chatMessages = await chatContRoller.postChatMessages(dateFormat(data));
      io.emit('editNickName', JSON.stringify(chatMessages));
    });
  
    socket.on('message', async (data) => {
      const chatMessages = await chatContRoller.postChatMessages(dateFormat(data, socket));
      console.log(chatMessages);
      console.log(socket.id);
      io.emit('message', JSON.stringify(chatMessages));
    });
  });
};

module.exports = chatIo;