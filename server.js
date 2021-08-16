const path = require('path');
const cors = require('cors');
const express = require('express');

const app = express();

const http = require('http').createServer(app);

app.use(cors());
const PORT = process.env.PORT || 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

require('./sockets/chat')(io);

app.use(express.static(`${__dirname}/views`));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (_, res) => {
    res.render('index');
});

http.listen(PORT, () => console.log(`Servidor Ligado na porta ${PORT}`));