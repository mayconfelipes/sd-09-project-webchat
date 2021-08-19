module.exports = (io, users) => {
  io.on('connection', (socket) => {
    socket.on('newUser', (nickname) => {
      users.push({ nickname, id: socket.id });
      io.emit('connected', { newUser: nickname, users });
    });
    socket.on('connected', () => {
      socket.emit('connected', { users });
    });
});
};
