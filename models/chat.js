const connection = require('./connection');

const postMessage = async ({ chatMessage, nickname, timeStamp }) => {
  const messageCollection = await connection().then((db) => db.collection('messages'));
  const response = await messageCollection.insertOne({ chatMessage, nickname, timeStamp });
  console.log('postmessage', response);
  return { status: 201, response };
};

const getAll = async () => {
  const messageCollection = await connection().then((db) => db.collection('messages'));
  const messages = await messageCollection.find().toArray();
  return { status: 200, messages };
};

module.exports = {
  postMessage,
  getAll,
};