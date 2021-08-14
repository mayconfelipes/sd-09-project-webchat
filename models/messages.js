const connection = require('./connection');

const post = async ({ chatMessage, nickname, timestamp }) => {
  const db = await connection();
  const collection = await db.collection('messages');
  await collection.insertOne({
    message: chatMessage,
    nickname,
    timestamp,
  });
};

const getAll = async () => {
 const db = await connection();
 const collection = await db.collection('messages');
 const messages = await collection.find({}).toArray();
 return messages;
};

module.exports = {
  post,
  getAll,
};
