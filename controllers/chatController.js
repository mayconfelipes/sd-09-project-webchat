const { Router } = require('express');
const rescue = require('express-rescue');
const chatModel = require('../models/chatModel');

const router = Router();

router.get('/', rescue(async (req, res) => {
  const messages = await chatModel.getAllMessages();
  return res.status(200).render('index', { messages }); 
}));

module.exports = router;