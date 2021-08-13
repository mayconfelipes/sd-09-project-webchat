const cors = require('cors');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'ejs'); // necessario para usar a engine(ejs)
app.set('views', path.join(__dirname, 'views'));

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization'],
  }),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (_req, res) => res.send('Hello World!'));

app.listen(PORT, () => console.log(`Express app listening on ${PORT}!`));