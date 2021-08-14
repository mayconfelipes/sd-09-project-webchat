const chatModel = require('../models/chat');

const postChatMessages = async ({ userId, chatMessage, nickname, formDate }) => {
  const messages = await chatModel.postChatMessages({ userId, chatMessage, nickname, formDate });
  return messages;
};

const getAllMessages = async () => {
  const messages = await chatModel.getAllMessages();
  return messages;
};

const updateChatUser = async ({ chatMessage, nickname }) => {
  const updateUser = await chatModel.updateChatUser({ chatMessage, nickname });
  return updateUser;
};

module.exports = {
  postChatMessages,
  getAllMessages,
  updateChatUser,
};