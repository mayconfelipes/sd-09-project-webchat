const express = require('express');
const messagesModel = require('../models/messages');

const router = express.Router();

router.get('/', async (_req, res, _next) => {
  console.log('entrei aqui');
  const messages = await messagesModel.getAll();
  return res.status(200).json(messages);
});

module.exports = router;