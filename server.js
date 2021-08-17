import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';

const dirname = path.resolve();

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(socket);
});

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(dirname, '/views/index.html'));
});

httpServer.listen(3000, () => { console.log('ouvindo na porta 3000'); });
