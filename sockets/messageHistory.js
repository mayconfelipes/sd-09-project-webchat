const ModelMessages = require('../models/ModelMessages');

module.exports = (io) => io.on('connection', async (socket) => {
  const historyMessages = await ModelMessages.getAllMessages();
  socket.emit('history', historyMessages);
});