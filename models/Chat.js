const create = async (connection, { id, chatMessage, nickname, timestamp }) => {
  await connection().then((db) =>
    db
      .collection('messages')
      .insertOne({ id, message: chatMessage, nickname, timestamp }));
};

const findAll = async (connection) => {
  const history = await connection().then((db) =>
    db.collection('messages').find({}).toArray());

  return history;
};

const updateNickname = async (connection, { id, nickname }) => {
  await connection().then((db) =>
    db
      .collection('messages')
      .updateMany({ id }, { $set: { nickname } }));
};

module.exports = {
  create,
  findAll,
  updateNickname,
};
