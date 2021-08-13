require('dotenv').config();
const path = require('path');
const express = require('express');
const { format } = require('date-fns');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  } });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

io.on('connection', (socket) => {
  console.log(`Usuário conectado, ID: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Usuário desconectado, ID: ${socket.id}`);
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    const date = format(new Date(), 'dd-MM-yyy hh:mm:ss a');
    io.emit('message', `${date} ${nickname} ${chatMessage}`);
  });
});

const port = process.env.PORT;

http.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});