const express = require('express');

const app = express();
const http = require('http').createServer(app);
const PORT = process.env.PORT || 3000;

const { chat } = require('./sockets');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }
});

chat(io);

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


http.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});