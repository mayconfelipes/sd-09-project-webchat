const express = require('express');

const app = express();
const http = require('http').createServer(app);

const PORT = process.env.PORT || 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(express.static(`${__dirname}/views`));

require('./sockets/chat')(io);

http.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});