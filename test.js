const moment = require('moment');

const date = new Date().toLocaleString('pt-BR').split('/').join('-');
console.log(date);

const timestamp = moment().format('DD-MM-yyyy LTS');
const timestamp2 = moment().format('yyyy-MM-DD LTS');
console.log(timestamp);
console.log(timestamp2);