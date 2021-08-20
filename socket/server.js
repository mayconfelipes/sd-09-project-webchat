// adriano me ajudou com essa função
// github.com/adrianoforcellini

const date = () => {
  const d = new Date();
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}
  ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
};

module.exports = (io) => {
  io.on('connection', async (socket) => {
    socket.on('message', (data) => {
      const novaData = `${date()} ${data.nickname}:${data.chatMessage}`;
      socket.broadcast.emit('message', novaData);
      socket.emit('message', novaData);
    });
  });
};