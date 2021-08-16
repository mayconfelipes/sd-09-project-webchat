const express = require('express');
const path = require('path');

const app = express();

const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const errorMiddleware = require('./middlewares/Error');

const { getChat } = require('./controllers/Chat');

const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(errorMiddleware);
app.use(express.static(path.join(__dirname, '/views')));

require('./sockets/Chat')(io);

app.get('/', getChat);

http.listen(PORT, () => console.log(`Listen ${PORT}`));
