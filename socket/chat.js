const moment = require('moment');

moment().format(); 

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Usuário conectado: ${socket.id} `);

    // socket.on('set_nickname', (nickname) => {
    //   socket.nickname = nickname;
    // })

    socket.on('message', ({ chatMessage, nickname }) => {
      const date = moment().format('DD-MM-YYYY h:mm:ss a');
      io.emit('message', `${date} - ${nickname}: ${chatMessage}`);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
