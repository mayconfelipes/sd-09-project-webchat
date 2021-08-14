const connection = require('./connection');

const create = async (idSocket) => {
  const connect = await connection();

  const createdUser = await connect.collection('users')
    .insertOne({ idSocket });

  return {
    id: createdUser.insertId,
    idSocket,
  };
};

const updateNickname = async ({ idSocket, nickname }) => {
  const connect = await connection();

  await connect.collection('users')
    .updateOne({ idSocket }, { $set: { nickname } });
};

const getAllUsers = async () => {
  const connect = await connection();

  const getAll = await connect.collection('users').find().toArray();

  return getAll;
};

const deleteUser = async (idSocket) => {
  const connect = await connection();

  await connect.collection('users').deleteOne({ idSocket });
};

module.exports = {
  create,
  updateNickname,
  getAllUsers,
  deleteUser,
};