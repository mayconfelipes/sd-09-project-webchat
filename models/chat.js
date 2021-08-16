const connect = require('./connection');

const setMessage = async ({ message, nickname, timestamp }) => {
  console.log(message);
  const db = await connect();
  const result = await db.collection('messages').insertOne({ message, nickname, timestamp });
  return result;
};

const getAll = async () => {
  const db = await connect();
  const messageList = await db.collection('messages').find().toArray();
  return messageList;
};

module.exports = { setMessage, getAll };
