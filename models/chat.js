const connection = require('./connection');

const getMessages = () => connection()
  .then((db) => db.collection('messages').find().toArray());

const addMessage = ({ message, nickname, timestamp }) => connection()
  .then((db) => db.collection('messages').insertOne({ message, nickname, timestamp }));

module.exports = {
  getMessages,
  addMessage,
};
