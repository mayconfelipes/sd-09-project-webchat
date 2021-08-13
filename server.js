require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const httpServer = require('http').createServer(app);

app.use(cors());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const webChatSocket = require('./socket/webChat');

webChatSocket(io);

app.get('/', (_req, res) => {
  res.render('webchat');
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Online na porta: ${PORT}.`);  
});
