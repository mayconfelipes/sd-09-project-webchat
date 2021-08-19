const express = require('express');

const app = express();
const http = require('http').createServer(app);

const ioServer = require('socket.io')(http);
require('./socket/chat')(ioServer);

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(`${__dirname}/public`));

app.get('/', (_req, res) => {
  res.render('chat');
});

http.listen(3000, () => {
console.log('Servidor ouvindo na porta 3000');
});