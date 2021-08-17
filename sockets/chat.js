module.exports = (io) => io.on('connection', (socket) => {
  socket.on('message', ({ chatMessage, nickname }) => {
    const fullDate = new Date();
    const day = fullDate.getDate();
    const month = (fullDate.getMonth() + 1);
    const year = fullDate.getFullYear();

    const hours = fullDate.getHours();
    const minutes = fullDate.getMinutes();

    const usrMsg = `${day}/${month}/${year} ${hours}:${minutes} ${nickname}: ${chatMessage}`;
    console.log(`${usrMsg}`);
    io.emit('message', usrMsg);
  });
});
