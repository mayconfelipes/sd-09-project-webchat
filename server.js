const express = require('express');
const { join } = require('path');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http,
  {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3000;

app.use(express.static(join(__dirname, 'public')));
app.set('views', join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);

app.use('/', (req, res) => {
  res.render('index.html');
});

require('./sockets/server')(io);

http.listen(PORT, () => {
  console.log('O Pai tá ON!!');
});
