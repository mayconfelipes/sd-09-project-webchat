const webchatModel = require('../models/webchat');

const chat = (_req, res, _next) => res.render('chat');

const create = async (msg) => {
  webchatModel.create(msg);
};

module.exports = {
  chat,
  create,
};