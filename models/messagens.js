const connection = require('./connection');

const saveMessage = async (message) => connection()
  .then((db) => db.collection('messages').insertOne({ ...message }))
  .catch((err) => console.error('saveMessage: ', err));

const getMessagens = async () => connection()
  .then((db) => db.collection('messages').find().toArray())
  .catch((err) => console.error('getMessagens: ', err));

module.exports = {
  saveMessage,
  getMessagens,
}; 
