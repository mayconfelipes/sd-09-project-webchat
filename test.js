const crypto = require('crypto');

const firstNick = crypto.randomBytes(8).toString('hex');
console.log(firstNick);