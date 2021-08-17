const connection = require('./connection');

const save = async ({ chatMessage, nickname, timestamp }) => connection()
  .then((db) => db.collection('messages').insertOne({
      message: chatMessage,
      nickname,
      timestamp,
    }).then(({ ops }) => ops[0]));

const getAll = async () => connection()
  .then((db) => db.collection('messages')
    .find({}).toArray());

module.exports = {
  save,
  getAll,
};
