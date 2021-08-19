const date = require('../js/getDate.js');
const mongo = require('../models/messages');
// socket.emit('changeName', { oldName, newName })

module.exports = (io) => {
  io.on('connection', async (socket) => {
    socket.emit('previousMessage', await mongo.findAll());
    socket.on('message', (data) => {
      const messageFormat = `${date()} ${data.nickname}:${data.chatMessage}`;
      mongo.addOne(messageFormat);
      socket.broadcast.emit('message', messageFormat);
      socket.emit('message', messageFormat);
    });
  });
};