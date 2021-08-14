const express = require('express');
const cors = require('cors');
const http = require('http');
require('dotenv').config();

const app = express();

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', './views');

const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});

const messagesController = require('./controllers/messages');
const webChat = require('./sockets/webchat');

webChat(io);

app.get('/', messagesController.getHistory);

app.use(express.static('public')); // Habilitar CSS e JS no front

httpServer.listen(process.env.PORT || 3000, () => (
  console.log(`Ouvindo na porta ${process.env.PORT}`)
));