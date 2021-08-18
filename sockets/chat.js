const moment = require('moment');

module.exports = (io) => io.on('connection', (socket) => {
  socket.on('message', ({ chatMessage, nickname }) => {
    const data = moment().format('DD-MM-yyyy HH:mm:ss'); // gerador de datas
    // socket.emit('serverMessage', 'Sejam bem vindos ao Web Chat da Trybe!');
    // console.log(`Message ${message}`);
    io.emit('message', `${data} ${nickname} ${chatMessage}`);
  });
  socket.on('user', (user) => {
    console.log(user);
  });
  socket.emit('nicknameSlice', socket.id.slice(0, 16));
});