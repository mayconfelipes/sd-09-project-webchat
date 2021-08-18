const express = require('express');

const app = express();
const http = require('http').createServer(app);
const path = require('path');
const ChatServer = require('./socket/chatServer');

const route = require('./routes/route');
// caminho da pasta public será montado de acordo com o sistema operacional
app.use(express.static(path.join(__dirname, 'public')));

// para poder usar as views com ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'views'));

// passa o http, para o socket que esta no server
ChatServer(http);
// route chama as rotas
app.use(route);

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
