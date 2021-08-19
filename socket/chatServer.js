const socketIo = require('socket.io');
const { getDataHora } = require('../public/helpers/usersFunctions');

const arrayMessages = [];
const arrayUsers = [];

const saveNickname = (io, nickname) => {
  if (!arrayUsers.includes(nickname)) { 
    arrayUsers.push(nickname); 
  }
  io.emit('listAllUsers', arrayUsers);
}; 

const mountMessage = (io, { chatMessage, nickname }) => { // io, aqui e para emitir informação
  const message = `${getDataHora()} - ${nickname}: ${chatMessage}`;
  arrayMessages.push(message);
  io.emit('message', JSON.stringify(message));
};

const alterNickname = (io, { OldNickname, newNickname }) => {
  const index = arrayUsers.indexOf(OldNickname);
  if (index > -1) { // se ele trazer pelo menos uma posição
    arrayUsers[index] = newNickname;
    io.emit('listAllUsers', arrayUsers); // para mandar o array atualizado
  } 
};

module.exports = (http) => {
  const io = socketIo(http, {
    cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST', 'PUT', 'DELETE'] } });
    io.on('connection', (socket) => {
      console.log('Alguém se conectou');
      socket.emit('listAllMessages', arrayMessages);
      socket.on('saveNickname', (nickname) => saveNickname(io, nickname));
      socket.emit('listAllUsers', arrayUsers);
      socket.on('disconnect', () => console.log('Alguém saiu'));
      socket.on('message', (objectMessage) => mountMessage(io, objectMessage));
      socket.on('alterNickname', (ObjectUser) => alterNickname(io, ObjectUser));
    });
};