// Faça seu código aqui
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const socketServer = require('http').createServer(app);
const controllers = require('./controllers');

app.use(cors());

const io = require('socket.io')(socketServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

require('./socket/chat')(io);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', controllers.loadPage);

const { PORT = 3000 } = process.env;

socketServer.listen(PORT, () => console.log(`listen on port ${PORT}`));