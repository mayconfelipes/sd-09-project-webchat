const moment = require('moment');

let onlineUsers = [];

const currentDate = () => (
  moment().format('DD-MM-yyyy h:mm:ss A')
);

const makeUser = (id) => {
  const user = {
    nickname: `user-${(id).slice(-11)}`,
    id,
  };
  return user;
};

const makeMessage = (nickname, chatMessage) => {
  const message = `${currentDate()} - ${nickname}: ${chatMessage}`;
  return message;
};

const filter = (userToChange) => {
  onlineUsers.filter((element) => {
    if (element.id === userToChange.id) {
      const index = onlineUsers.indexOf(element);
      onlineUsers[index].nickname = userToChange.nickname;
    }
    return true;
  });
};

module.exports = (io) => io.on('connection', (socket) => {
  const user = makeUser(socket.id);
  onlineUsers.push(user);
  io.emit('userConnected', user);
  io.emit('usersOnline', onlineUsers);

  socket.on('newNickName', (userToChange) => {
    filter(userToChange);
    io.emit('nickNameChanged', onlineUsers);
  });

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter((element) => element.id !== socket.id);
    socket.broadcast.emit('usersOnline', onlineUsers);
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    io.emit('message', makeMessage(nickname, chatMessage));
  });
});
