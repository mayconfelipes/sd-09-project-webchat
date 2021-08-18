const connection = require('./connection');

const getAllMessages = () => connection().then(
  (db) => db.collection('messages').find({}).toArray(),
);

const addNewMessage = (msg) => connection().then((db) => db.collection('messages').insertOne(msg));

module.exports = {
  addNewMessage,
  getAllMessages,
};