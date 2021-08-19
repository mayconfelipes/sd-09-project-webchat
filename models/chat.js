const connection = require('./connection');

const saveMessage = async ({ message, nickname, timestamp }) => {
  const db = await connection();
  const newMessage = await db.collection('messages').insertOne({ message, nickname, timestamp });
  return newMessage;
};

const getMessages = async () => {
  const db = await connection();
  const messages = await db.collection('messages').find().toArray();
  return messages;
};

module.exports = {
  saveMessage,
  getMessages,
};