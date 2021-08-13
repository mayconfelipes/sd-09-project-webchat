const express = require('express');
const cors = require('cors');
const http = require('http');
const { format } = require('date-fns');
require('dotenv').config();

const app = express();

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', './views');

const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`Usuario ${socket.id} conectado.`);

  socket.on('nickname', (nickname) => {
    io.emit('nickname', nickname);
  });
  
  socket.on('message', ({ nickname, chatMessage }) => {
    const date = format(new Date(), 'dd-MM-yyyy HH:mm:ss');
    io.emit('message', `${date} - ${nickname}: ${chatMessage}`);
  });
  
  socket.on('disconnect', () => {
    console.log(`Usuario ${socket.id} desconectou`);
  });
});

app.get('/', (_req, res) => res.status(200).render('webchat'));

app.use(express.static('public')); // Habilitar CSS e JS no front

httpServer.listen(process.env.PORT || 3000, () => (
  console.log(`Ouvindo na porta ${process.env.PORT}`)
));