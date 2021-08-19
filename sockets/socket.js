const { Server } = require('socket.io');

const app = require('../app');

const io = new Server(app);

module.exports = io;
