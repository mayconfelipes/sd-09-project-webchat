const chatModel = require('../models/chatModel');

module.exports = (io) => io.on('connection', (socket) => {
  const randoNickname = socket.id.slice(0, 16);
  const onlineUsers = [];
  onlineUsers.push({ id: socket.id, randoNickname });

  io.emit('usersConnected', onlineUsers);

  socket.on('message', async ({ chatMessage, nickname }) => {
    const date = new Date().toLocaleString('pt-BR').split('/').join('-');
    
    const formatedMsg = `${date} - ${nickname}: ${chatMessage}`;

    await chatModel.createMessageDB(formatedMsg);

    io.emit('message', formatedMsg);
    // io.emit('historyMessages', async (messages) => {}});
  });

  /* socket.on('nickname', (nickname) => {

  }); */
});