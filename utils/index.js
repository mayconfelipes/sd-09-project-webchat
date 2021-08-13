const moment = require('moment');

function formatDate() {
  const timestampMessage = moment(Date.now()).format('DD-MM-yyyy HH:mm:ss');

  return timestampMessage;
}

module.exports = {
  formatDate,
};