const app = require('express')();
const cors = require('cors');
const express = require('express');
const http = require('http').createServer(app);
const path = require('path');

const PORT = 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});

app.use(cors());

require('./sockets/webChat')(io);

app.use(express.static(path.join(__dirname, '/public/')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/chat.html')));

http.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));