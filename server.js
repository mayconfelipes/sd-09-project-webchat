const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const httpServer = http.createServer(app);
app.use(cors());

// sockets
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});

const webChat = require('./socket/webChat');

webChat(io);

app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('webchat'));

const PORT = process.env.BACKEND_PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
