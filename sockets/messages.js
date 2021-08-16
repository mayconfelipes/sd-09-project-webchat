const messages = (io) => {
  io.on('connection', (socket) => {
    socket.on('message', ({ chatMessage, nickname }) => {
      const data = new Date();
      const formatedDate = `${data.getDate()}-${data.getMonth()}-${data.getFullYear()}`;
      const formatedHour = `${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}`;
      io.emit('message', `${formatedDate} ${formatedHour} - ${nickname}: ${chatMessage}`);
    });
  });
};

module.exports = messages;