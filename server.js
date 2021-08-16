// Faça seu código aqui
const express = require('express');
const http = require('http');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const chatRoutes = require('./controllers/chat');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const sockets = require('./sockets/chat');

sockets.connect(io);

app.use(chatRoutes);

server.listen(PORT, () => console.log(`Server listening on Port ${PORT}`));
