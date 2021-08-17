const connection = require('./connection');
// model: acesso e manipulacao de dados + regras de negocio/validacoes

const getAllMessages = () => connection().then((db) => {
  db.collection('messages').find().toArray();
});

const addNewMessage = ({ message, nickname, timestamp }) => connection().then((db) => {
  db.collection('messages').insertOne({ message, nickname, timestamp });
});

module.exports = {
  addNewMessage,
  getAllMessages,
};
