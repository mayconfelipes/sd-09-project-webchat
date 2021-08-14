// Faça seu código aqui
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

require('./sockets/chat')(io);

app.use(express.static(`${__dirname}/public`));

app.get('/', (_req, res) => res.sendFile(`${__dirname}/public/chat.html`));

http.listen(PORT, () => console.log(`Servidor Ligado na porta ${PORT}`));
