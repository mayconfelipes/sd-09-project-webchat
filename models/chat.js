const connection = require('./connection');

const getAll = async () => connection()
  .then((db) => db.collection('messages').find().toArray())
  .then((items) => items.map(({ message, nickname, timestamp }) => ({
    message,
    nickname,
    timestamp,
  })));

const create = async (message, nickname, timestamp) => connection()
  .then((db) => db.collection('messages').insertOne({ message, nickname, timestamp }))
  .then(() => ({ message, nickname, timestamp }));

module.exports = {
  getAll,
  create,
};
