const express = require('express');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http);

const controllerMessage = require('./controllers/historicController');

app.set('views', 'views');
// 1º Quem está sendo setando /2° rotas
app.set('view engine', 'ejs');

app.use(express.static('public'));

require('./sockets/chat')(io);

app.use('/', (req, res) => {
  res.render('index');
});

app.post('/', controllerMessage.historicController);

http.listen(3000, () => {
  console.log('Ouvindo na porta 3000');
});