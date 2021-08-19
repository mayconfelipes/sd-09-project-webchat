const moment = require('moment');
const historicMessage = require('../models/historicMessage');

module.exports = (io) => io.on('connection', async (socket) => {
  socket.on('message', ({ chatMessage, nickname }) => {
    const data = moment().format('DD-MM-yyyy HH:mm:ss'); // gerador de datas
    // socket.emit('serverMessage', 'Sejam bem vindos ao Web Chat da Trybe!');
    // console.log(`Message ${message}`);
    historicMessage.saveMessage({ message: chatMessage, nickname, timestamp: data });
    io.emit('message', `${data} ${nickname} ${chatMessage}`);
  });
  socket.on('user', (user) => {
    console.log(user);
  });
  const messages = await historicMessage.historicMessage()
  .then((msn) => msn.map((m) => `${m.timestamp} ${m.nickname} ${m.message}`));

  socket.emit('messages', messages);
  socket.emit('nicknameSlice', socket.id.slice(0, 16));
});