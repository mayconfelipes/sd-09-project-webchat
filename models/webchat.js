const connection = require('./connection');

const create = async (msg) => {
    const { message, nickname, timestamp } = msg;

    const newMessage = await connection()
      .then((db) => db.collection('messages').insertOne({ message, nickname, timestamp }))
      .then((result) => result.ops[0]);
  
    const { _id } = newMessage;
    
    return {
      user: {
        message,
        nickname,
        timestamp,
        _id,
      },
    };
};

// const getAll = () => connection()
//       .then((db) => db.collection('webchat').find().toArray());

const getAll = async () => connection().then((db) => db.collection('messages').find().toArray());
 
module.exports = {
  create,
  getAll,
};