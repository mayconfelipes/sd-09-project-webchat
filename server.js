const express = require('express');

const app = express();
const http = require('http').createServer(app);

const PORT = 3000;

const io = require('socket.io')(http, { 
  cors: {
    origin: `http://localhost:${PORT}`,
    method: ['GET', 'POST'],
  },
});

require('./sockets/chatServer')(io);

app.use('/public', express.static('public'));
http.listen(3000, () => { console.log(`Rodando na porta: ${PORT}`); });

// unica rota para aplicação 'CHAT-SinglePageApp'
app.get('/', (_req, res) => { res.sendFile(`${__dirname}/public/index.html`, { news: 'NEWS' }); });
