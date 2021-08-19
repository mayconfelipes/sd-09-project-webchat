const connection = require('./connection');

const insertMessage = async (dataMessage) => {
  const { message, nickname, timestamp } = dataMessage;
  const db = await connection();
  const collection = await db.collection('messages');
  await collection.insertOne({
    message,
    nickname,
    timestamp,
  });
};

const getAllMessages = async () => {
  const db = await connection();
  const collection = await db.collection('messages');
  const allMessages = await collection.find().toArray();
  return allMessages;
};

module.exports = {
  insertMessage,
  getAllMessages,
};
