const { format } = require('date-fns');
const connection = require('./connection');

const create = async (message, nickname) => {
  const messagesCollection = await connection()
  .then((db) => db.collection('messages'));

  const timestamp = format(new Date(), 'dd-MM-yyy hh:mm:ss a');
  
  const { ops } = await messagesCollection.insertOne({ message, nickname, timestamp });
  
  return ops[0];
};

const findAll = async () => {
  const messagesCollection = await connection()
  .then((db) => db.collection('messages'));

  const recipesList = await messagesCollection.find().toArray();

  return recipesList;
};

module.exports = {
  create,
  findAll,
};