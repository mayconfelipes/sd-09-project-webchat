const socketIo = require('socket.io');
const { getDataHora } = require('../public/helpers/usersFunctions');

const arrayMessages = [];
const arrayUsers = [];

module.exports = (http) => {
  const io = socketIo(http, {
    cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST', 'PUT', 'DELETE'] } });
    io.on('connection', (socket) => {
      console.log('Alguém se conectou');
      socket.emit('listAllMessages', arrayMessages);
      socket.on('saveNickname', (nickname) => {
        if (!arrayUsers.includes(nickname)) { arrayUsers.push(nickname); }
        io.emit('listAllUsers', arrayUsers);
      });
      socket.emit('listAllUsers', arrayUsers);
      socket.on('disconnect', () => console.log('Alguém saiu'));
      socket.on('message', ({ chatMessage, nickname }) => {
        const message = `${getDataHora()} - ${nickname}: ${chatMessage}`;
        arrayMessages.push(message);
        io.emit('message', { message });
      });
    });
};