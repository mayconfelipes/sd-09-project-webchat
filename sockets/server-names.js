/* eslint-disable max-lines-per-function */
let nickNames = [];
const nick = (item) => item.nickname;

const onConnect = (io) => {
  io.on('connection', async (socket) => {
    socket.emit('nickname');

    socket.on('sendName', (data) => {
      nickNames.push(data);
      socket.broadcast.emit('receivedNames', nickNames);
      socket.emit('receivedNames', nickNames);
    });

    socket.on('changeName', (objNames) => {
      const { oldName, newName } = objNames;
      console.log(objNames);
      const names = nickNames.map(nick);
      console.log(names, 'antes da mudança');
      const index = names.indexOf(oldName);
      nickNames[index].nickname = newName;
      console.log(nickNames.map(nick), 'pós mudança');
      socket.broadcast.emit('receivedNames', nickNames);
      socket.emit('receivedNames', nickNames);
    });
  });
};

const onDisconnect = (io) => {
  io.on('connection', async (socket) => {
    socket.on('disconnect', () => {
      nickNames = nickNames.filter((item) => item.id !== socket.id);
      socket.broadcast.emit('receivedNames', nickNames);
      socket.emit('receivedNames', nickNames);
    });
  });
};

module.exports = (io) => {
  onDisconnect(io);
  onConnect(io);
};
