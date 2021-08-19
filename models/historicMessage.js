const connection = require('./connection');

const historicMessage = async () => {
  const history = await connection()
  .then((db) => db
  .collection('messages')
  .find().toArray());

  return history;
};

const saveMessage = async (message) => {
  await connection().then((db) => db.collection('messages').insertOne(message));
};

module.exports = {
  historicMessage,
  saveMessage,
};