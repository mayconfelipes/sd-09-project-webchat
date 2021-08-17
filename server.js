const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const handleEventsSocket = require('./sockets');

app.set('views', path.join(__dirname, 'views'));

app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');

handleEventsSocket(io);

app.use('/', (req, res) => {
  res.render('index.html');
});

server.listen(3000, () => console.log('escutando na porta 3000'));
