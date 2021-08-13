const connection = require('./connection');
require('dotenv').config();

const getAllMessages = async () => {
  const result = await connection()
    .then((db) => db.collection(process.env.DB_NAME)
      .find({}).toArray());

  return result;
};

module.exports = getAllMessages;
