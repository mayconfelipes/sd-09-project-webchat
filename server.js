// Faça seu código aqui
const express = require('express');
const cors = require('cors');
const path = require('path');
// const { Server } = require('socket.io');
const app = express();
const socketServer = require('http').createServer(app);
// const io = new Server(socketServer);

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

app.get('/', (req, res) => {
  res.status(200).render('index');
  // res.sendFile(__dirname + '/index.html')
});

const { PORT = 3000 } = process.env;

socketServer.listen(PORT, () => console.log(`listen on port ${PORT}`));