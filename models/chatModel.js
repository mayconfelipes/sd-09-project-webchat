const { ObjectId } = require('mongodb');
const connection = require('./connection');

const findMessages = async (id) => {
  if (id === undefined) {
    const i = await connection().then((db) => db.collection('messages').find().toArray());
    return i;
  }
  const obj = await connection().then((db) => db.collection('messages').find({
    _id: ObjectId(id),
  }).toArray());

  return obj[0];
};

const createMessage = async (message, nickName, timestamp) => {
  const msg = await connection().then((db) => db.collection('messages').insertOne({
    message,
    nickName,
    timestamp,
  }));
  return msg.insertedId;
};

const createUsers = async (nickname, status) => {
  const user = await connection().then((db) => db.collection('users').insertOne({
    nickname, status,
  }));
  return user.insertedId;
};

const updateUser = async (id, newNickname) => {
  const user = await connection().then((db) => db.collection('users').updateOne({
    _id: ObjectId(id),
  },
  {
    $set: { nickname: newNickname },
  }));
  if (user.modifiedCount === 1) return;
  throw new Error('Update nao realizafo');
};

const updateUserStatus = async (id, status) => {
  const user = await connection().then((db) => db.collection('users').updateOne({
    _id: ObjectId(id),
  },
  {
    $set: { status },
  }));
  if (user.modifiedCount === 1) return;
  throw new Error('Update nao realizafo');
};

const findUser = async (id) => {
  if (id === undefined) {
    const i = await connection().then((db) => db.collection('users').find().toArray());
    return i;
  }
  const obj = await connection().then((db) => db.collection('users').find({
    _id: ObjectId(id),
  }).toArray());

  return obj[0];
};

const deleteUser = async (id) => {
  await connection().then((db) => db.collection('users').find({
    _id: ObjectId(id),
  }));
};
module.exports = {
  findMessages,
  createMessage,
  createUsers,
  findUser,
  updateUser,
  deleteUser,
  updateUserStatus,
};