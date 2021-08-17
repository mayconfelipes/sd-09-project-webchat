const connection = require('./connection');

const create = (message) => connection().then((db) =>
  db.collection('messages').insertOne(message).then(({ ops }) => ops[0]));

const getAll = () => connection().then((db) =>
  db.collection('messages').find().toArray());

module.exports = { create, getAll };
