require('dotenv').config();
const path = require('path');
const http = require('http');
const cors = require('cors');
const express = require('express');
const { Server } = require('socket.io');
const socket = require('./sockets/chat');
const { findAll } = require('./models/messageModel');

const { PORT } = process.env;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_req, res) => {
  res.render('index.html');
});

app.get('/test', async (_req, res) => {
  try {
    const result = await findAll();
    return res.send(result);
  } catch (error) {
    console.log(error);    
  }
});

socket(io);

server.listen(PORT, () => console.log(`listening on ${PORT}`));
