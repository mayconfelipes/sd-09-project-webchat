const express = require('express');

const app = express();
const http = require('http').createServer(app);

app.use(express.static(`${__dirname}/public`));
app.set('view engine', 'ejs');

app.set('views', './views');
require('dotenv/config');

const PORT = process.env.PORT || 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

require('./sockets/Chat')(io);

const ChatController = require('./controllers/ChatController.js');

app.get('/', ChatController);

http.listen(PORT, console.log('CHAT ONLINE'));
