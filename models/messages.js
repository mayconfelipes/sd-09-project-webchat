const connect = require('./connection');

const getAll = async () => (
  connect().then((db) => db.collection('messages').find().toArray())
);

const updateHistory = async ({ timestamp, nickname, message }) => (
  connect().then(async (db) => {
    const updatedHistory = await db.collection('messages')
      .insertOne({ timestamp, nickname, message });
    return updatedHistory.ops[0];
  })
);

module.exports = {
  getAll,
  updateHistory,
};
