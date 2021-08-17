const webchatModel = require('../models/webchat');

const chat = (_req, res, _next) => res.render('chat');

const currentTimeDb = () => {
  const data = new Date();
  const a = String(data.getFullYear());
  const m = String(data.getMonth()).padStart(2, '0');
  const d = String(data.getDate()).padStart(2, '0');
  const h = String(data.getHours());
  const mi = String(data.getMinutes()).padStart(2, '0');
  const s = String(data.getSeconds()).padStart(2, '0');

  return `${d}-${m}-${a} ${h}:${mi}:${s}`;
};

const create = async (msg) => {
  const { message, nickname } = msg;
  const timestamp = currentTimeDb();
  const newMessage = await webchatModel.create({ message, nickname, timestamp });
  console.log(newMessage);
};

const getAll = async () => webchatModel.getAll();

module.exports = {
  chat,
  create,
  getAll,
};