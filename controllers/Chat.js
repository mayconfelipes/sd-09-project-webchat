const create = async (connection, Chat, { id, chatMessage, nickname, timestamp }) => {
  await Chat.create(connection, { id, chatMessage, nickname, timestamp });
};

const findAll = async (connection, Chat) => {
  const messages = await Chat.findAll(connection);

  return messages;
};

const updateNickname = async (connection, Chat, { id, nickname }) => {
  await Chat.updateNickname(connection, { id, nickname });
};

module.exports = {
  create,
  findAll,
  updateNickname,
};