const connection = require('./connection');

const saveMessages = (msg) => connection()
  .then((db) => db.collection('messages').insertOne(msg));

const getMessages = () => connection()
  .then((db) => db.collection('messages').find().toArray());

module.exports = {
  saveMessages,
  getMessages,
};
