module.exports = (io) => io.on('connection', (socket) => {
  socket.on('message', (msg) => {
    io.emit('message', msg);
  });
});