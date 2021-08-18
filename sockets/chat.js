module.exports = (io) => io.on('connection', (socket) => {
  socket.on('message', ({ chatMessage, nickname }) => {
    const fullDate = new Date();
    const day = fullDate.getDate();
    const month = fullDate.getMonth();
    const year = fullDate.getFullYear();

    const hours = fullDate.getHours();
    const minutes = fullDate.getMinutes();

    const usrMsg = `
      ${day}-${month}-${year} ${hours}:${minutes} ${nickname}: ${chatMessage}
    `;
    io.emit('message', usrMsg);
  });

  socket.emit('wellcome', 'Cheguei');

  socket.on('changeName', () => {
    socket.emit('changeName', 'Nome alterado com sucesso :)');
  });
});
