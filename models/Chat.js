const create = async (connection, { chatMessage, nickname, timestamp }) => {
  await connection()
    .then((db) => db.collection('messages').insertOne({ message: chatMessage, nickname, timestamp }));
};

const findAll = async (connection) => {
  const history = await connection()
    .then((db) => db.collection('messages').find({}).toArray());

  return history;
};

module.exports = {
  create,
  findAll,
};