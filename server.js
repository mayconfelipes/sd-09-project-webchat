const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const httpServer = http.createServer(app);
app.use(cors());

// sockets
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});

const webChatController = require('./controllers/webChatController');

const webChat = require('./socket/webChat');

webChat.webChat(io);

app.use(express.static(path.join(__dirname, '/public')));

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  const messages = await webChatController.getSavedMessages();

  res.render('webchat', { users: webChatController.connectedUsers, messages });
});

const PORT = process.env.BACKEND_PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
