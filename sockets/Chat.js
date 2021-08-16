const moment = require('moment');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Usuário conectado. ID: ${socket.id} `);

    socket.on('message', ({ chatMessage, nickname }) => {
      const date = moment().format('DD-MM-YYYY hh:mm:ss');
      io.emit('message', `${date} - ${nickname}: ${chatMessage}`);
    });
  });
};
