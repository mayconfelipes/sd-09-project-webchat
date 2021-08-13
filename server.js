const express = require('express');

const app = express();
const http = require('http').createServer(app);

// const io = require('socket.io')(http, {
//   cors: {
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST'], 
//   },
// });

const PORT = process.env.PORT || 3000;
// require('./sockets/chat')(io);

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

http.listen(PORT, () => {
  console.log('O Pai tá ON!!');
});
