const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static('public'));
app.set('views', 'views');
app.set('view engine', 'ejs');

io.on('connection', (socket) => {
  console.log(`${socket.id} connected`);
});

app.use('/', (_req, res) => res.render('index'));

server.listen(3000, () => console.log('conectado na porta 3000'));
