const connection = require('./connection');

const create = async (message) => connection()
    .then((db) => db.collection('messages').insertOne(message));

const find = async () => connection()
    .then((db) => db.collection('messages').find().toArray());

module.exports = {
    create,
    find,
};