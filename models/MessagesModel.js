const connection = require('./connection');

const addOneMessage = async (mongoMessageObject) => {
  const message = await connection()
    .then((db) => db.collection('messages').insertOne(mongoMessageObject));
  return message.ops[0];
};

const findAllMessages = async () => {
  const messages = await connection()
    .then((db) => db.collection('messages').find().toArray());
  return messages;
};

module.exports = {
  addOneMessage,
  findAllMessages,
};
