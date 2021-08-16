require('dotenv').config();

const express = require('express');
const path = require('path');

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
const Message = require('./models/Message');

sockets(io);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (_req, res) => {
  const message = new Message({});
  const messages = await message.getAll();

  res.render('index', { messages });
});

http.listen(
  PORT,
  () => console.log(`Listening on port ${PORT}`),
);