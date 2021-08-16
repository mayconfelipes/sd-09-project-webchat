const connection = require('./connection');

const create = async ({ nickname, chatMessage: message, timestamps: timestamp }) => {
  const db = await connection();
  const response = await db
    .collection('messages').insertOne({ nickname, message, timestamp });
  return response.ops[0];
};

const getAll = async () => {
  const db = await connection();
  const response = await db.collection('messages').find().toArray();
  return response;
};

module.exports = {
  getAll,
  create,
};