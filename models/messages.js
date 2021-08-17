const connection = require('./connection');

const postMessage = async (messageObj) => {
  const db = await connection();

  const messageCollection = await db.collection('messages');

  const newMessage = await messageCollection.insertOne(messageObj);

  const message = await newMessage.ops[0];

  return newMessage && message;
};

const getAllMessages = async () => {
  const db = await connection();

  const messageCollection = await db.collection('messages');

  const messages = await messageCollection.find().toArray();

  return messages;
};

module.exports = {
  postMessage,
  getAllMessages,
};
