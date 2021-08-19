const createNickName = require('../../utils/createNickName');
const dateNowFormated = require('../../utils/dateNowFormated');
const CreateMessage = require('../../models/CreateMessage');
const GetMessages = require('../../models/GetMessages');

module.exports = (io) => {
  io.on('connection', async (socket) => {
    socket.emit('welcome', {
      nickname: createNickName(16),
      messages: await GetMessages(),
    });

    socket.on('message', ({ nickname, chatMessage }) => {
      const date = dateNowFormated();
      CreateMessage({ message: chatMessage, nickname, timestamp: date });
      io.emit('message', `${date} - ${nickname}: ${chatMessage}`);
    });
  });
};
