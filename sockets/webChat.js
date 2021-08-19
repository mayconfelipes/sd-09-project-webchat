const moment = require('moment');

module.exports = (io) => {
  io.on('connection', (socket) => {
    const currentTime = moment().format('DD-MM-yyyy LTS');

    socket.emit('serverMessage', 'Bem vindo ao TrybeChat');

    socket.broadcast.emit('serverMessage', `user${socket.id} entrou no chat`);

    socket.on('disconnect', () => {
      socket.broadcast.emit('serverMessage', `user${socket.id} saiu do chat`);
    });

    socket.on('message', ({ chatMessage, nickname }) => {
      io.emit('message', `${currentTime} - ${nickname}: ${chatMessage}`);
    });

    socket.on('changeNickname', ({ nickname, newNickname }) => {
      io.emit('serverMessage', `${nickname} agora é ${newNickname}`);
    });
  });
};
