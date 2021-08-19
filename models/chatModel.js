const connection = require('./connection');

module.exports = {
  saveMsgs: async ({ message, nickname, timestamp }) => {
    await connection()
      .then((db) => db.collection('messages').insertOne({ message, nickname, timestamp }));
  },
  getMesgs: async () => connection()
    .then((db) => db.collection('messages').find().toArray()),
};
