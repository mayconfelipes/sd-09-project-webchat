const connection = require('./connection');

const createMessage = (message) => connection().then((db) =>
  db.collection('messages').insertOne(message).then(({ ops }) => ops[0]));

const getMessages = async () => connection()
    .then((db) => db.collection('messages').find().toArray());

module.exports = { createMessage, getMessages };