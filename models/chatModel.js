const connection = require('./connection');

const getMessages = () => {
  const messages = connection()
    .then((db) => db.collection('messages').find().toArray());
  return messages;
};

const saveMessage = (chatMessage, nickname, timestamp) => connection()
    .then((db) => db.collection('messages').insertOne({
      message: chatMessage,
      nickname,
      timestamp,
    }));

module.exports = {
  getMessages,
  saveMessage,
};
