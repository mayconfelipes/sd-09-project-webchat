const connection = require('./connection');

// const disconnectUser = async (socketId) => {
//   await connection().then((db) => db.collection('users').deleteOne({ socketId }));
// };

// const changeNickname = async (newNickname, socketId) => {
//   await connection().then((db) => db.collection('users')
//     .findOneAndUpdate({ socketId }, { $set: { nickname: newNickname } }));
// };

const saveMessage = async ({ message, nickname, messageTimeStamp }) => {
  await connection().then((db) => db.collection('messages')
    .insertOne({ message, nickname, messageTimeStamp }));
};

const getSavedMessages = async () => connection()
  .then((db) => db.collection('messages').find({}).toArray());

module.exports = {
  // disconnectUser,
  // changeNickname,
  saveMessage,
  getSavedMessages,
};