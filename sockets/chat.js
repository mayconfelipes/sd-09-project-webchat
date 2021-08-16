const moment = require('moment');

moment.defaultFormat = 'DD-MM-yyyy HH:mm:ss';

module.exports = (io) => io.on('connection', (socket) => {
  const formatDate = moment().format();
  socket.on('message', ({ nickname, chatMessage }) => {
    io.emit('message', `${formatDate} - ${nickname}: ${chatMessage}`);
    console.log(`Mensagem ${chatMessage}`);
  });
});
