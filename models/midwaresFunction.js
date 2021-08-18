const conn = require('./connection');

const getall = async () => {
  const result = await conn().then(async (db) => db.collection('messages').find().toArray());
  return result;
};

const insertOne = async (param) => {
  const messageObject = {
    timestamp: param.timestamp,
    nickname: param.nickname,
    message: param.message,
  };
const result = await conn().then(async (db) => db.collection('messages').insertOne(messageObject));
  return result.ops[0];
};

const fromDb = async () => {
  const list = [];
  const all = await getall();
 // console.log('mid_fromdb', all);  
  all.forEach((el) => {
      const toText = `${el.timestamp} - ${el.nickname}: ${el.message}`;
      list.push(toText);
    });
  // console.log('mid_fr', list);
  return list;
};

module.exports = {
insertOne,
fromDb,
getall,
};