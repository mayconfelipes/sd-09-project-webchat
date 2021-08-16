const connection = require('./connection');

const getMessages = () => {
  const messages = connection()
    .then((db) => db.collection('messages').find().toArray());
  return messages;
};

const saveMessage = (message) => {
  const { content, user } = message;
  return connection()
    .then((db) => db.collection('messages').insertOne({
      content,
      user,
      timestamp: new Date(),
    })).ops[0];
};

module.exports = {
  getMessages,
  saveMessage,
};
