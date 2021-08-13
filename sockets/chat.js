const moment = require('moment');

module.exports = (io) => io.on('connection', (socket) => {
  socket.emit('userOn', socket.id);

  socket.on('nickname', (nickname) => {
    console.log(nickname);
  });

  socket.on('message', ({ nickname, chatMessage }) => {
    const date = moment().format('DD-MM-YYYY');
    const hour = moment().format('LTS');
    const messageFormat = `${date} ${hour} - ${nickname}: ${chatMessage}`;
    io.emit('message', messageFormat);
  });
});