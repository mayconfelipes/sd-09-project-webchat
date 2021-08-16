module.exports = (io, socket) => {
  socket.on(
    'message',
    ({ chatMessage, nickname = 'anonymous' }) => {
      const now = new Date();
      const day = (`0${now.getDate()}`).slice(-2);
      const month = (`0${now.getMonth() + 1}`).slice(-2);
      const year = now.getFullYear();
      const hour = (`0${now.getHours()}`).slice(-2);
      const minute = (`${now.getMinutes()}`).slice(-2);
      const second = (`0${now.getSeconds()}`).slice(-2);
      const date = `${day}-${month}-${year} ${hour}:${minute}:${second}`;

      const message = `${date} - ${nickname}: ${chatMessage}`;
      io.emit('message', message);
    },
  );
};