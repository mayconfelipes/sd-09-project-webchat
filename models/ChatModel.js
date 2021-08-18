const connection = require('./connection');

const createNewMsg = async ({ message, nickname, timestamp }) => {
  const db = await connection();

  const result = await db
  .collection('messages')
  .insertOne({ message, nickname, timestamp });

  return result;
};

const getAllMsgs = async () => {
  const db = await connection();

  const result = await db
  .collection('messages')
  .find()
  .toArray();

  return result;
};

module.exports = {
  createNewMsg,
  getAllMsgs,
};