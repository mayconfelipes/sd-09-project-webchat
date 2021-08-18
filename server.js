require('dotenv/config');

const express = require('express');

const app = express();
const http = require('http').createServer(app);

const ioServer = require('socket.io')(http);
require('./sockets/ChatSockets')(ioServer);

app.set('view engine', 'ejs');
app.set('views', './public');

app.use(express.static(`${__dirname}/public`));

app.get('/', (_req, res) => {
  res.render('ChatIndex');
});

http.listen(process.env.PORT, () => {
  console.log(`Listen on port ${process.env.PORT}`);
});