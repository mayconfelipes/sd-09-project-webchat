const moment = require('moment');
const crypto = require('crypto');

moment.defaultFormat = 'DD-MM-yyyy HH:mm:ss';

module.exports = (io) => io.on('connection', (socket) => {
  const formatDate = moment().format();
  const randomNick = crypto.randomBytes(8).toString('hex');
  socket.on('message', ({ nickname = randomNick, chatMessage }) => {
    console.log(`Mensagem ${chatMessage}`);
    io.emit('message', `${formatDate} - ${nickname}: ${chatMessage}`);
  });
});
