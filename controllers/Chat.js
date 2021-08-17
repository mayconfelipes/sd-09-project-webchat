const create = async (connection, Chat, { chatMessage, nickname, timestamp }) => {
  await Chat.create(connection, { chatMessage, nickname, timestamp });
};

const findAll = async (connection, Chat) => {
  const messages = await Chat.findAll(connection);

  return messages;
};

module.exports = {
  create,
  findAll,
};