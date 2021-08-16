const conn = require('./connection');

const postMessage = async (message, nickname, timestamp) => {
  const messagesCollection = await conn()
    .then((db) => db.collection('messages'));

  try {
    const messagePosted = await messagesCollection
    .insertOne({ message, nickname, timestamp });

    return {
      status: 201,
      messagePosted,
    };
  } catch (error) {
    return { status: 500, message: error.message };
  }
};

const getAll = async () => {
  const messagesCollection = await conn()
    .then((db) => db.collection('messages'));

  try {
    const chat = await messagesCollection.find({}).toArray();
  
    return {
      status: 200,
      chat,
    };
  } catch (error) {
    return { status: 500, message: error.message };
  }
};

module.exports = {
  postMessage,
  getAll,
};