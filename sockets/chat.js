const randomstring = require('randomstring');

const chatIo = (io, messages, dateFormat) => {
  io.on('connection', (socket) => {
    console.log(`Socket conectado com id: ${socket.id}`);
  
    socket.emit('previousMessage', messages);
  
    socket.emit('randomNickName', randomstring.generate(16));
  
    socket.on('message', (data) => {
      console.log(data);
      messages.push(data);
      io.emit('message', JSON.stringify(dateFormat(data)));
    });
  });
};

module.exports = chatIo;