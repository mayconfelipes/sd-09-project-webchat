const connection = require('./connection');

const saveMessages = async (message) => {
  await connection().then((db) =>
    db.collection('messages').insertOne(message));
};

const getHistory = async () => {
  const request = await connection().then((db) => 
    db.collection('messages').find().toArray());

  return request;
};

module.exports = {
  saveMessages,
  getHistory,
};
