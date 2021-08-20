const express = require('express');
const { join } = require('path');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);

// basiado no video da youtube
// https://www.youtube.com/watch?v=-jXfKDYJJvo&t=539s
app.use(express.static(join(__dirname, 'public')));
app.set('views', join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

require('./socket/server')(io);

app.get('/', (_req, res) => {
  res.renderFile('index.html');
});

http.listen(PORT, () => {
  console.log(`App esta escutando na porta ${PORT}`);
});
