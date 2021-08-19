const connection = require('./connection');

const collectionMessages = 'messages';

const create = async (message, nickname, timestamp) => {
  await connection().then((db) =>
    db.collection(collectionMessages).insertOne({ message, nickname, timestamp }));
  return `${timestamp} - ${nickname}: ${message}`;
};

const findAll = async () => {
  const allMessages = await connection().then((db) =>
    db
      .collection(collectionMessages)
      .find()
      .toArray()
      .then((messages) => {
        if (messages.length === 0) {
          return messages;
        }
        return messages.map(
          (message) =>
            `${message.timestamp} - ${message.nickname}: ${message.message}`,
        );
      }));
  return allMessages;
};

module.exports = {
  create,
  findAll,
};