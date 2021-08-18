const express = require('express');
require('dotenv').config();

const app = express();
const http = require('http').createServer(app);

const PORT = 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(express.static(`${__dirname}/public`));

require('./sockets/chat')(io);

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/public/chat.html`);
});

http.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});