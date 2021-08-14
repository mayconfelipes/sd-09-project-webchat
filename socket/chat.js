const moment = require('moment');
// const { getAll, saveMessage } = require('../models/messages');

moment().format(); 
const onlineUsers = [];

const socketChat = (io) => {
  io.on('connection', async (socket) => {
    let actualnickname = '';
    socket.on('new_user', (nickname) => {
      actualnickname = nickname;
      onlineUsers.push(nickname);
      io.emit('onlineUsers', onlineUsers);
    });

    socket.on('update_nickname', ({ oldNickname, nickname }) => {
      actualnickname = nickname;
      onlineUsers
        .forEach((user, i) => (user === oldNickname) && onlineUsers.splice(i, 1, nickname));
      io.emit('onlineUsers', onlineUsers);
    });

    // const messages = await getAll();
    // socket.emit('load_messages', messages);

    // socket.on('message', async ({ chatMessage, nickname }) => {
    //   const date = moment().format('DD-MM-YYYY h:mm:ss a');
    //   io.emit('message', `${date} - ${nickname}: ${chatMessage}`);
    //   await saveMessage(chatMessage, nickname, date) });

    socket.on('disconnect', () => {
      onlineUsers.forEach((user, i) => (user === actualnickname) && onlineUsers.splice(i, 1));
      io.emit('onlineUsers', onlineUsers);
    });
  });
};

module.exports = socketChat;
