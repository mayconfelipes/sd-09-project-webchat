const {
  handleChangeNickname,
  handleMessageEvent,
  handleWithNewConnection,
  handleWithDisconnectEvent,
} = require('../services/socket');

const handleEventsSocket = async (io) => {
  io.on('connection', async (socket) => {
    await handleWithNewConnection(io, socket);

    socket.on('message', async ({ chatMessage, nickname }) => {
      await handleMessageEvent(io, chatMessage, nickname);
    });

    socket.on('changeNickname', async ({ userId, newNickname }) => {
      await handleChangeNickname(io, socket, userId, newNickname);
    });

    socket.on('connected', async ({ userId }) => {
      console.log('no connec');
      await handleWithDisconnectEvent(io, userId);
    });

    socket.on('disconnect', async () => {
      console.log('user disconnected');
      io.emit('areYouConnected?');
    });
  });
};

module.exports = handleEventsSocket;