const express = require('express');
const webchatController = require('../controller/webchat');

const webChatRouter = express.Router();

webChatRouter.get('/', webchatController.getAllMessages);

module.exports = webChatRouter;