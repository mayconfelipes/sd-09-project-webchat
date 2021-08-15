const express = require('express');

const app = express();
const http = require('http').createServer(app);

const PORT = process.env.PORT || 3000;

const io = require('socket.io')(http, { 
  cors: {
    origin: `http://localhost:${PORT}`,
    method: ['GET', 'POST'],
  },
});

require('./sockets/chatServer')(io);

app.use(express.static(`${__dirname}/public`));
// unica rota para aplicação 'CHAT-SinglePageApp'
app.get('/', (_req, res) => res.sendFile(`${__dirname}/public/index.html`));

http.listen(PORT, () => { console.log(`Rodando na porta: ${PORT}`); });
