const crypto = require('crypto');

module.exports = (io) => io.on('connection', (socket) => {
  const firstNick = crypto.randomBytes(8).toString('hex');
  socket.emit('myNickname', firstNick);
  socket.broadcast.emit('nickname', { nickname: firstNick, id: socket.id });

  socket.on('message', ({ chatMessage, nickname }) => {
    const timestamps = new Date().toLocaleString('pt-br').replace(/\//g, '-');
    const message = `${timestamps} - ${nickname}: ${chatMessage}`;
    io.emit('message', message);
  });

  socket.on('nickname', (nickname) => {
    socket.emit('myNickname', nickname);
    socket.broadcast.emit('nickname', { nickname, id: socket.id });
  });
});