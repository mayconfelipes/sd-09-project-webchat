module.exports = (io, users, messages) => {
  io.on('connection', (socket) => {
    socket.emit('oldMessages', messages);
    socket.on('message', ({ nickname, chatMessage }) => {
      const options = { timeZone: 'America/Bahia' };
      const date = new Date().toLocaleDateString('pt-BR', options).split('/').join('-');
      const time = new Date().toLocaleTimeString('pt-BR', options);
      messages.push({ chatMessage, nickname, date, time });
      io.emit('message', `<time>${date} ${time}</time> ${nickname}: ${chatMessage}`);
    });
  });
};