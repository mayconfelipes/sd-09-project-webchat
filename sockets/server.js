const date = require('../js/getDate.js');

module.exports = (io) => {
  const messages = [];
  const nickNames = [];
  io.on('connection', (socket) => {
    socket.emit('previousMessage', messages);
    socket.emit('previousNames', nickNames);

    socket.on('message', (data) => {
      const messageFortmat = `${date()} ${data.nickname}:${data.chatMessage}`;
      messages.push(messageFortmat);
      console.log(messageFortmat);
      socket.broadcast.emit('message', messageFortmat);
      socket.emit('message', messageFortmat);
    });

    socket.on('sendName', (data) => {
      nickNames.push(data);
      socket.broadcast.emit('receivedName', data);
    });
  });
};