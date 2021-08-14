const connection = require('./connection');

const saveMessage = async ({ message, nickname, timestamp }) => {
  await connection()
    .then((db) => db.collection('messages').insertOne({ message, nickname, timestamp })); 
};

const getMessage = async () => connection()
    .then((db) => db.collection('messages').find({}).toArray());

module.exports = {
  saveMessage,
  getMessage,
};
