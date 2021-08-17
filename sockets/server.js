const date = require('../js/getDate.js');
const mongo = require('../models/messages');

module.exports = (io) => {
  // const messages = [];
  const nickNames = [];
  io.on('connection', async (socket) => {
    socket.emit('previousMessage', await mongo.findAll());
   
    socket.emit('previousNames', nickNames);

    socket.on('message', (data) => {
      const messageFormat = `${date()} ${data.nickname}:${data.chatMessage}`;
      // messages.push(messageFormat);
      mongo.addOne(messageFormat);
      console.log(messageFormat);
      socket.broadcast.emit('message', messageFormat);
      socket.emit('message', messageFormat);
    });

    socket.on('sendName', (data) => {
      nickNames.push(data);
      socket.broadcast.emit('receivedName', data);
    });
  });
};