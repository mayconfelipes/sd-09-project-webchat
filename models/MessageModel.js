const connection = require('./connection');

const getCollection = async () => connection()
  .then((db) => db.collection('messages'));

const create = async ({ message, nickname, timestamp }) => {
  const messages = await getCollection();
  const { insertedId } = messages.insertOne({ message, nickname, timestamp });
  return { _id: insertedId, message, nickname, timestamp };
};

const findAll = async () => getCollection().then((db) => db.find().toArray());

module.exports = {
  create,
  findAll,
};
