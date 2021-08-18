const express = require('express');
const cors = require('cors');
const ChatController = require('../controllers/ChatController');

const route = express.Router();

route.use(cors());
route.use(ChatController);

module.exports = route;
