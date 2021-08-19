const express = require('express');
const path = require('path');
const socket = require('socket.io');

const PORT = process.env.PORT || 3000;

const app = express();

const http = require('http').createServer(app);

const webChat = require('./sockets/webChat');
const webChatModel = require('./models/webChat');
const webChatController = require('./controllers/webChatController')(webChatModel);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const io = socket(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

webChat(io, webChatController);

app.get('/', async (req, res) => {
  const messageHistory = await webChatController.getMessageHistory();

  res.render('chat', { messageHistory });
});

http.listen(PORT, () => console.log(`Servidor ouvindo na porta ${PORT}`));
