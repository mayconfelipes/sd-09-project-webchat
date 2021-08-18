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

/* const updateOnlineUserDB = async (id, nickname) => {
  const db = await connection();
  const user = db.collection('users').updateOne({ $set: { id, nickname } }, { upsert: true });
  return user;
};

const getAllOnlineUsers = async () => {
  const db = await connection();
  const users = db.collection('users').find({}).toArray();
  return users;
}; */

module.exports = {
  createMessageDB,
  getAllMessagesDB,
  // updateOnlineUserDB,
  // getAllOnlineUsers,
};