const express = require('express');

const app = express();
const http = require('http').createServer(app);

const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

const io = require('socket.io')(http, {
  cors: {
    origin: `http://localhost:${PORT}`,
    methods: ['GET', 'POST'],
  },
});

require('./sockets/message')(io);

const models = require('./models');

const allMessages = models.getAllMessages();

app.get('/', (_req, res) => {
  res.render('messages', { allMessages });
});

http.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
