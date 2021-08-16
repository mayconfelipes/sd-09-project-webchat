const connection = require('./connection');

const saveLogMessage = async (message, nickname, timestamp) => {
  await connection().then((db) => {
    db.collection('messages').insertOne({ message, nickname, timestamp });
  });
};

const getAllMessages = async () => {
  const messageLog = await connection().then((db) =>
    db.collection('messages').find({}).toArray());
  return messageLog;
};

module.exports = {
  saveLogMessage,
  getAllMessages,
};
