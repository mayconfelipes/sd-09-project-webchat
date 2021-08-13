require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');

const PORT = process.env.PORT || 3000;

const app = express();
const httpServer = http.createServer(app);

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(express.static(path.join(__dirname, '/view')));

require('./sockets/chat')(io);

app.get('/ping', (req, res) => res.status(200).send('pong'));

httpServer.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));