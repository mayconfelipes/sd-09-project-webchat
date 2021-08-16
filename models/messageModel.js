const connection = require('./connection');

const create = async (msg) => {
  const { message, nickname, timestamp } = msg;
  const schema = await connection();
  await schema.collection('messages').insertOne({ message, nickname, timestamp });
};

const findAll = async () => {
  const schema = await connection();
  const messages = await schema.collection('messages').find().toArray();
  const result = messages.map((message) => ({
    chatMessage: message.message,
    nickname: message.nickname,
    timestamp: message.timestamp,
  }));
  return result;
};

module.exports = {
  create,
  findAll,
};