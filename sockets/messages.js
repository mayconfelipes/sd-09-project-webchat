const messages = (io) => {
  io.on('connection', (socket) => {
    socket.on('message', ({ chatMessage, nickname }) => {
      const data = new Date();
      const formatedDate = `${data.getDate()}-${data.getMonth()}-${data.getFullYear()}`;
      const formatedHour = `${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}`;
      io.emit('message', `${formatedDate} ${formatedHour} - ${nickname}: ${chatMessage}`);
    });

    socket.on('newConnection', (nickname) => {
      io.emit('newConnection', nickname);
    });

    socket.on('updateNickname', ({ oldNickname, newNickname }) => {
      io.emit('updateNickname', { oldNickname, newNickname });
    });
  });
};

module.exports = messages;