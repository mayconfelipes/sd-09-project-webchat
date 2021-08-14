module.exports = (io) => io.on('connection', (socket) => {
  // console.log('usuário conectado');

  socket.on('message', ({ chatMessage, nickname }) => {
    const date = new Date().toLocaleString('pt-BR').split('/').join('-');

    console.log(date);
    io.emit('message', `${date} - ${nickname}: ${chatMessage}`);
  });
});