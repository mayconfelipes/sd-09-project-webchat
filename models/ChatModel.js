const connection = require('./connection');

const saveMessages = async (data) => {
  await connection().then((db) => db.collection('messages').insertOne(data));
};

const getMessages = async () => {
  const messages = await connection()
    .then((db) => db.collection('messages').find().toArray());

  return messages;
};

module.exports = {
  saveMessages,
  getMessages,
};