const connection = require('./connection');

const postMessage = async ({ message, nickname, timestamp }) => {
  await connection()
    .then((db) => db.collection('messages').insertOne({ message, nickname, timestamp })); 
};

const fetchMessageHistory = async () => connection()
    .then((db) => db.collection('messages').find({}).toArray());

module.exports = {
  postMessage,
  fetchMessageHistory,
};