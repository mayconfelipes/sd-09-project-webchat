module.exports = (io, changeNickname) => {
  io.on('connection', (socket) => {
    socket.on('newNickname', (nicknames) => {
      changeNickname(nicknames);
      io.emit('newNickname', nicknames);
    });
  });
};
