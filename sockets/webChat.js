const moment = require('moment');

module.exports = (io) => {
  io.on('connection', (socket) => {
    const currentTime = moment().format('DD-MM-yyyy LTS');

    // socket.emit('message', `Bem vindo user${socket.id}`);
    // socket.broadcast.emit('message', `user${socket.id} entrou no chat`)

    // socket.on('disconnect', () => {
    //   socket.broadcast.emit('message', `user${socket.id} saiu do chat`);
    // });

    socket.on('message', ({ chatMessage, nickname }) => {
      io.emit('message', `${currentTime} - ${nickname || `user${socket.id}`}: ${chatMessage}`);
    });
  });
};
