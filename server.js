const express = require('express');

const app = express();

const http = require('http').createServer(app);

const port = 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(express.static(`${__dirname}/public`));

require('./sockets/chatServer')(io);

http.listen(port, () => {
  console.log('App rodando na porta', port);
});
