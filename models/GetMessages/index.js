const connection = require('../connection');

module.exports = async () => {
  const result = await connection()
    .then((db) => db.collection('messages').find().toArray());

  return result;
};
