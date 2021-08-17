const connection = require('./connection');

const findAll = async () => connection()
  .then((db) => db.collection('messages').find().toArray());

const addOne = async (message) => connection()
  .then((db) => db.collection('messages').insertOne({ message }));

module.exports = {
  findAll,
  addOne,
};