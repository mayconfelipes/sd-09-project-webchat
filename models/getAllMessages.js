const connection = require('./connection');
require('dotenv').config();

const getAllMessages = async () => {
  const result = await connection()
    .then((db) => db.collection('messages')
      .find({}).toArray());

  return result;
};

module.exports = getAllMessages;
