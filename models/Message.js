const connection = require('./connection');

class Message {
  constructor({ message = '', nickname = '', timestamp = '' }) {
    this.collection = 'messages';
    this.message = message;
    this.nickname = nickname;
    this.timestamp = timestamp;
  }

  validate() {
    const hasEmptyProperty = Object.values(this).some((value) => !value);

    if (hasEmptyProperty) throw new Error('Empty property');
  }

  create() {
    const { collection, ...messageData } = this;

    this.validate();

    return connection()
      .then((db) => db.collection(this.collection))
      .then((col) => col.insertOne(messageData));
  }

  getAll() {
    return connection()
      .then((db) => db.collection(this.collection))
      .then((col) => col.find().toArray());
  }
}

module.exports = Message;
