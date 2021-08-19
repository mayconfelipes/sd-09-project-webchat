/* eslint-disable max-lines-per-function */
let nickNames = [];
const nick = (item) => item.nickname;
const onConnect = (io) => {
  io.on('connection', async (socket) => {
    socket.emit('nickname');

    socket.on('sendName', (data) => {
      nickNames.push(data);
      socket.broadcast.emit('receivedNames', nickNames.map(nick));
      socket.emit('receivedNames', nickNames.map(nick));
    });

    socket.on('changeName', (objNames) => {
      const { oldName, newName } = objNames;
      const names = nickNames.map(nick);
      const index = names.indexOf(oldName);
      const newObj = nickNames[index];
      console.log(newObj);
      newObj.nickname = newName;
      socket.broadcast.emit('receivedNames', nickNames.map(nick));
      socket.emit('receivedNames', nickNames.map(nick));
    });
  });
};

const onDisconnect = (io) => {
  io.on('connection', async (socket) => {
    socket.on('disconnect', () => {
      nickNames = nickNames.filter((item) => item.id !== socket.id);
      socket.broadcast.emit('receivedNames', nickNames.map(nick));
      socket.emit('receivedNames', nickNames.map(nick));
    });
  });
};

const together = (io) => {
  onDisconnect(io);
  onConnect(io);
};

module.exports = together;