const moment = require('moment');

const formatData = () => {
  const [date, time, period] = moment().format('DD-MM-yyyy, h:mm:ss a').split(' ');
  const data = `${date.slice(0, 10)} ${time} ${period.toUpperCase()}`;

  return data;
};

module.exports = formatData;