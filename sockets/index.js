const moment = require('moment');

let users = [];

const allNicknames = () => users.map((user) => user.nickname);
const updateList = (io) => io.emit('updateList', allNicknames());
const findUser = (socket) => users.find((user) => user.socket === socket);
const removeUser = (socket) => {
  users = users.filter((user) => user.socket !== socket);
};

const createUser = (socket) => {
  const newUser = { socket, nickname: socket.id.slice(0, 16).toString() };
  users.push(newUser);
  return newUser;
};

const chat = (io) => {
  io.on('connection', (socket) => {
    createUser(socket);
    socket.on('nickname', (nickname) => {
      const userFound = findUser(socket);
      if (userFound) userFound.nickname = nickname;
      updateList(io);
    });
    updateList(io);
    socket.on('message', ({ nickname, chatMessage }) => {
      const timestamp = moment().format('DD-MM-yyyy LTS');
      let message = '';
      if (!nickname) message = `${timestamp} - ${socket.nickname}: ${chatMessage}`;
      else message = `${timestamp} - ${nickname}: ${chatMessage}`;
      io.emit('message', message);
    });
    socket.on('disconnect', () => { removeUser(socket); updateList(io); });
  });
};

module.exports = { chat };
