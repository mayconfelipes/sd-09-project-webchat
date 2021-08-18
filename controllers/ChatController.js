const express = require('express');

const chatRouter = express.Router();

chatRouter.get('/', (req, res) => {
  res.render('chatClient');
});

module.exports = chatRouter;