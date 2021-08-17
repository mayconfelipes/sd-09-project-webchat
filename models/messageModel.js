const connection = require('./connection');

const createMessage = async (message, nickname) => {
await connection()
  .then((db) => db.collection('messages')
  .insertOne({ message, nickname, timestamp: new Date().toLocaleString('es-CL') })); // o formatdo de data do chile bate com o pedido
};

module.exports = {
  createMessage,
};
