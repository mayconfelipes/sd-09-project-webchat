const connection = require('./connection');

const create = (message, nickname, timestamp) => {
   connection().then((db) =>
    db.collection('messages').insertOne({ message, nickname, timestamp }));
};

// teste

const getAll = () => connection().then((db) => db.collection('messages').find({}).toArray());

module.exports = {
  getAll,
  create,
};