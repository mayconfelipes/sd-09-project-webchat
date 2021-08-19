const connection = require('./connection');

const saveMessage = async ({ chatMessage, nickname, timestamp }) => {
  const db = await connection();
  const collection = await db.collection('messages');
  await collection.insertOne({
    message: chatMessage,
    nickname,
    timestamp,
  });
};

const getHistory = async () => {
 const db = await connection();
 const collection = await db.collection('messages');
 const messages = await collection.find({}).toArray();
 return messages;
};

module.exports = {
  saveMessage,
  getHistory,
};