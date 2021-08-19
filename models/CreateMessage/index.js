const connection = require('../connection');

module.exports = async (message) => {
  await connection().then((db) => db.collection('messages').insertOne(message));
};
