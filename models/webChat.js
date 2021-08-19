const connection = require('./connection');

const save = async (message) => {
  await connection().then((db) =>
    db.collection('messages').insertOne({ message }));
};

const getAll = async () => {
  const messages = await connection().then((db) =>
    db.collection('messages').find().toArray());

  return messages;
};

module.exports = { save, getAll };
