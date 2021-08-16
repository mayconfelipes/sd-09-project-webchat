const connection = require('./connection');

const createMessageDB = async (message, nickname, timestamp) => {
  const db = await connection();
  const newMsg = db.collection('messages').insertOne({ message, nickname, timestamp });
  return newMsg;
};

const getAllMessagesDB = async () => {
  const db = await connection();
  const messages = db.collection('messages').find({}).toArray();
  return messages;
};

module.exports = {
  createMessageDB,
  getAllMessagesDB,
};