const webChatController = require('../controllers/webChatController');

const webChat = (io) => io.on('connection', async (socket) => {
  const { id } = socket;
  // await webChatController.connectUser(id);
  const oldMessages = await webChatController.getSavedMessages();

  socket.emit('oldMessages', (oldMessages));

  socket.emit('tempNickname', (id.slice(0, 16)));

  socket.on('changeNickname', (newNickname) => webChatController
    .changeNickname(newNickname, id, socket, io));

  socket.on('message', async ({ chatMessage, nickname }) => webChatController
    .saveMessage({ message: chatMessage, nickname, io }));

  socket.on('usersList', () => {
    webChatController.getUserList(id, io);
  });

  socket.on('disconnect', () => webChatController.disconnectUser(id, io));
});

module.exports = webChat;