const socketIo = require('socket.io');
const { getDataHora, createNickname } = require('../public/helpers/usersFunctions');
const ChatModel = require('../models/ChatModel');

const arrayUsers = [];
let nicknameOnline;

const saveNickname = (io, socket, nickname) => {
  if (!arrayUsers.includes(nickname)) { // validação para não duplicar dados
    arrayUsers.push({ nickname, id: socket.id });
  }
  io.emit('connected', { arrayUsers, nicknameOnline: nickname });
}; 

const mountMessage = async (io, { chatMessage, nickname }) => { // io, aqui e para emitir informação
  const message = await ChatModel.create(chatMessage, nickname, getDataHora()); // criando no banco
  io.emit('message', JSON.stringify(message));
};

const alterNickname = (io, socket, { newNickname }) => {
  const index = arrayUsers.findIndex((user) => user.id === socket.id);
  if (index > -1) { // se ele trazer pelo menos uma posição
    arrayUsers[index].nickname = newNickname;
    io.emit('listAllUsers', arrayUsers); // para mandar o array atualizado 
  } 
};

const desconectUser = (io, socket) => { // passo io aqui para poder fazer um .emit for exemple
  const index = arrayUsers.findIndex((user) => user.id === socket.id);
    if (index > -1) {
      arrayUsers.splice(index, 1); // excluindo usuario que desconectou
      io.emit('listAllUsers', arrayUsers);
    }
};

module.exports = (http) => {
  const io = socketIo(http, {
    cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST', 'PUT', 'DELETE'] } });
    io.on('connection', async (socket) => {
      nicknameOnline = createNickname(16);
      saveNickname(io, socket, nicknameOnline);
      
      socket.emit('listAllMessages', await ChatModel.findAll());
      // socket.on('saveNickname', (nickname) => saveNickname(io, nickname));
      socket.emit('listAllUsers', arrayUsers);
      socket.on('disconnect', () => desconectUser(io, socket));
      socket.on('message', (objectMessage) => mountMessage(io, objectMessage));
      socket.on('alterNickname', (ObjectUser) => alterNickname(io, socket, ObjectUser));
    });
};