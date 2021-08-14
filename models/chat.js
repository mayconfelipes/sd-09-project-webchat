const connection = require('./connection');

const postChatMessages = ({ userId, chatMessage, nickname, formDate }) => connection()
  .then((db) => db.collection('messages')
  .insertOne({ userId, message: chatMessage, nickname, timestamp: formDate }))
  .then((result) => result.ops[0]);

const getAllMessages = () => connection().then((db) => db.collection('messages')
  .find().toArray());

  // const updateChatUser = ({ chatMessage, nickname }) => connection()
  // .then((db) => db.collection('messages')
  // .update({ chatMessage }, { $set: { nickname } }))
  // .then((result) => result);
 
module.exports = {
  postChatMessages,
  getAllMessages,
  // updateChatUser,
};