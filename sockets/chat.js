module.exports = (io) => io.on('connection', (socket) => {
  console.log(socket.id);
  socket.on('message', ({ chatMessage, nickname }) => {
    const timestamps = new Date().toLocaleString('pt-br').replace(/\//g, '-');
    const message = `${timestamps} - ${nickname}: ${chatMessage}`;
    io.emit('message', message);
  });

  socket.on('nickname', (nickname) => {
    io.emit('nickname', nickname);
  });
});