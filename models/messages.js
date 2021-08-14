const connection = require('./connection');

const getAll = () => connection().then(
  (db) => db.collection('messages').find().toArray(),
);

const saveMessage = (message, nickname, timestamp) => connection()
  .then((db) => db.collection('messages').insertOne(
    { message, nickname, timestamp },
  ));

module.exports = {
  getAll,
  saveMessage,
};
