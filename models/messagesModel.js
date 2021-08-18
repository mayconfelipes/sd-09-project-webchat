const connection = require('./connection');

const getAllMsgs = async () => (
  connection().then((db) => db.collection('messages').find().toArray())
);

const addMsg = async (message) => {
  connection().then((db) => db.collection('messages').insertOne({ ...message }));
};

module.exports = {
  getAllMsgs,
  addMsg,
};
