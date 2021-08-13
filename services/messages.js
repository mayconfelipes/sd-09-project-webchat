const connection = require('../models/connection');

const getMessage = () => connection()
    .then((db) => db.collection('messages').find().toArray());

const postMessage = (message) => connection()
    .then((db) => db.collection('messages').insertOne(message));
    
module.exports = {
    getMessage,
    postMessage,

};