require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');

const PORT = process.env.PORT || 3000;

const app = express();
const httpServer = http.createServer(app);

app.use(cors());

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// const messagesController = require('./controllers/messages');

app.use(express.static(path.join(__dirname, '/view')));
// app.set('view engine', 'ejs');

// app.set('views', './view');

require('./sockets/chat')(io);

app.get('/ping', (req, res) => res.status(200).send('pong'));

// app.use('/', messagesController);

httpServer.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));