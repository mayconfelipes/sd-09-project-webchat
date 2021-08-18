const connection = require('./connection');

const getAllMessages = async () => {
  const db = await connection();
  const allMessages = await db.collection('messages').find().toArray();
  return allMessages;
};

const createMessage = async (message) => {
  const db = await connection();
   await db.collection('messages').insertOne({ message });
};

module.exports = {
  getAllMessages,
  createMessage,
};