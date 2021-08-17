// Faça seu código aqui

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

app.get('/', (req, res) => {
  res.send(`${__dirname}/index.html`);
});

io.on('connection', (socket) => {
  console.log('bichao entro');

  socket.on('disconnect', () => {
    console.log('bichao saiu  - deisconnect');
  });
});

server.listen(PORT, () => {
  console.log(`vrawwwwwww na porta : ${PORT}`);
});