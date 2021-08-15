// messages model
const connection = require('./connection');

const addOneUser = async (userObject) => {
  const user = await connection()
    .then((db) => db.collection('users').insertOne(userObject));
  return user.ops[0];
};

const findAllUsers = async () => {
  const users = await connection()
    .then((db) => db.collection('users').find().toArray());
  return users;
};

const deleteOneUser = async (userID) => {
  await connection().then((db) => db.collection('users').deleteOne({ id: userID }));
  return '';
};

const updateOneUser = async (id, name) => {
  const user = await connection()
    .then((db) => db.collection('users').updateOne(
      { id },
      { $set: { name } },
      { upsert: true },
    ))
    .then(() => ({ id, name }));
  return user;
};

module.exports = {
  addOneUser,
  findAllUsers,
  deleteOneUser,
  updateOneUser,
};