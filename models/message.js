const connect = require('./connection');

const getAll = async () => 
  connect().then((db) => db.collection('messages').find({}).toArray());

const addMessage = async ({ message, nickname, timestamp }) =>
  connect().then(async (db) => {
  const result = await db.collection('messages').insertOne({ message, nickname, timestamp });
  return result.ops[0];
  });

module.exports = { getAll, addMessage };