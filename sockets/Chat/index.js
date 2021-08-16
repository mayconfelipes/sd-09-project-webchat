const dateNowFormated = require('../../utils/dateNowFormated');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('message', ({ nickname, chatMessage }) => {
      const date = dateNowFormated();
      io.emit('message', `${date} - ${nickname}: ${chatMessage}`);
    });
  });
};
