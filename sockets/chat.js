const moment = require('moment');

module.exports = (io) => io.on('connection', (socket) => {
  socket.on('message', (data) => {
    const dateTime = moment().format('DD-MM-YYYY HH:mm:ss');
    const msg = `${dateTime} - ${data.nickname}: ${data.chatMessage}`;
    io.emit('message', msg);
    console.log(msg);
  });
});
