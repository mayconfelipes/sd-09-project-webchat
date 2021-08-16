require('dotenv').config();

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

const sockets = require('./sockets');

sockets(io);

app.use(express.static(`${__dirname}/public`));

app.get('/', (_req, res) => res.sendFile(`${__dirname}/public/index.html`));

http.listen(
  PORT,
  () => console.log(`Listening on port ${PORT}`),
);