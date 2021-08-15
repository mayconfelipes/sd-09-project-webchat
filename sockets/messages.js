const messages = (io) => {
  io.on('connection', (socket) => {
    socket.on('message', ({ chatMessage, nickname }) => {
      io.emit('message', `${Date.now()} - ${nickname}: ${chatMessage}`);
    });
  });
};

module.exports = messages;