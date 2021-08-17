const connection = require('./connection');

const saveMessage = async (message, nickname, timestamp) => {
  const messagesCollection = await connection()
    .then((db) => db.collection('messages'));

  await messagesCollection.insertOne({ message, nickname, timestamp });
};

const getAllMessages = async () => {
  const messagesCollection = await connection()
    .then((db) => db.collection('messages'));
  
  const response = await messagesCollection.find().toArray();
  return response;
};

module.exports = {
  saveMessage,
  getAllMessages,
};
