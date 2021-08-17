const date = require('../js/getDate.js');
const mongo = require('../models/messages');

const nickNames = [];
module.exports = (io) => {
  io.on('connection', async (socket) => {
    socket.emit('previousMessage', await mongo.findAll());
    socket.emit('nickname');

    socket.on('message', (data) => {
      const messageFormat = `${date()} ${data.nickname}:${data.chatMessage}`;
      mongo.addOne(messageFormat);
      console.log(messageFormat);
      socket.broadcast.emit('message', messageFormat);
      socket.emit('message', messageFormat);
    });

    socket.on('sendName', (data) => {
      console.log('sendname', data);
      nickNames.push(data);
      console.log('nickNames', nickNames);
      socket.broadcast.emit('receivedNames', nickNames);
      socket.emit('receivedNames', nickNames);
    });
  });
};