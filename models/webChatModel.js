const connection = require('./connection');

const formatMessage = ({ message, nickname, timestamp }) => (
  `${timestamp} - ${nickname}: ${message}`
);

const registerNewMessage = async (message) => (
  connection()
    .then((db) => db.collection('messages').insertOne(message))
);

const getAllMessages = async () => {
  const allMessages = await connection()
    .then((db) => db.collection('messages').find({}).toArray());
  const result = allMessages.map(formatMessage);
  return result;
};

module.exports = {
  registerNewMessage,
  getAllMessages,
};
