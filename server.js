const app = require('express')();
const http = require('http').createServer();
const cors = require('cors');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST', 'PUT']
  }
})

app.use(cors());

app.set('view engine', 'ejs');

app.set('views', './views');

io.on('connection', (socket) => {
  console.log('Alguém entrou na sala');
})

app.get('/', (req, res) => {
  res.status(200).render('chat')
});

http.listen(3000, () => {
  console.log('Conectado na porta 3000');
});
