// Faça seu código aqui
const express = require('express');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { // instancia IO
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  } });

const controllers = require('./controllers');

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(`${__dirname}/public`)); // Configura url publica

require('./sockets/messages')(io); // insere no app script do socket que gerencia mensagens back

// configura rota / para enviar index.html
app.get('/', controllers.chat.homeView);

// Sobe servidor express
http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});