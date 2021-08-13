const connection = require('./connection');

const create = async (message) => {
  const connect = await connection();

  const createdMessage = await connect.collection('messages')
    .insertOne({ message });

  return {
    id: createdMessage.insertId,
    message,
  };
};

const getAllMessages = async () => {
  const connect = await connection();

  const getAll = await connect.collection('messages').find().toArray();

  return getAll;
};

module.exports = {
  create,
  getAllMessages,
};
