const chatModel = require('../models/chatModel');

const newConnection = (socket) => {
  socket.emit('wellcome', 'Cheguei');
};

const message = (socket, io) => {
  socket.on('message', ({ chatMessage, nickname }) => {
    const fullDate = new Date();
    const day = fullDate.getDate();
    const month = fullDate.getMonth();
    const year = fullDate.getFullYear();

    const hours = fullDate.getHours();
    const minutes = fullDate.getMinutes();

    const timestamp = `${day}-${month}-${year} ${hours}:${minutes}`;

    const usrMsg = `${timestamp} ${nickname}: ${chatMessage}`;

      chatModel.saveMsgs({ message: chatMessage, nickname, timestamp });

    io.emit('message', usrMsg);
  });
};

const msgHistory = (socket) => {
  socket.on('msgHistory', async () => {
    const getMesgs = await chatModel.getMesgs();
    socket.emit('getMesgs', getMesgs);
  });
};

const changeName = (socket, io) => {
  socket.on('changeName', () => {
    io.emit('changeName', 'Nome alterado com sucesso :)');
  });
};

module.exports = (io) => io.on('connection', (socket) => {
  newConnection(socket);
  message(socket, io);
  msgHistory(socket);
  changeName(socket, io);
});
