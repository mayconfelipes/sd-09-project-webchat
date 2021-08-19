const express = require('express');

const app = express();
const http = require('http');

const server = http.createServer(app);

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

app.get('/', (_req, res) => {
  res.render('chat');
});

app.get('/ping', (_req, res) => res.json({ message: 'pong!' }));

module.exports = server;
