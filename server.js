require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const http = require('http').createServer(app);

const { PORT } = process.env;

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});

const router = require('./routes/RouteChat');

require('./sockets/chat')(io);

app.use(express.static(path.join(__dirname, '/public')));

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

app.use(router);

http.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
