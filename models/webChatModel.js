const connection = require('./connection');
// model: acesso e manipulacao de dados + regras de negocio/validacoes

const getAllMessages = () => connection().then((db) => {
  const messages = db.collection('messages').find().toArray();
  return messages;
});

const addNewMessage = ({ message, nickname, timeStamp }) => connection().then((db) => {
  const added = db.collection('messages').insertOne({ message, nickname, timeStamp });
  return added.ops[0];
});

module.exports = {
  addNewMessage,
  getAllMessages,
};
