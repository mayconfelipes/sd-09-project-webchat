const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

module.exports = router;