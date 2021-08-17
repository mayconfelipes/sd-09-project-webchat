const connection = require('./connection');

module.exports = {
  saveMsgs: async ({ message }) => {
    await connection()
      .then((db) => db.collection('messages').insert({ message }));
  },
  getMesgs: async () => connection()
    .then((db) => db.collection('messages').find().toArray()),
};
