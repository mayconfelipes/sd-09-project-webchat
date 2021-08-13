const adjustFormat = (number) => {
  if (number >= 10) return number;
  const adjusted = `0${number}`;
  return adjusted; 
};

const dateFormat = (date) => {
  const year = date.getFullYear();
  const month = adjustFormat(date.getMonth() + 1);
  const day = adjustFormat(date.getDate());
  const fullDate = `${day}-${month}-${year}`;

  return fullDate;
};

const hourFormat = (date) => {
  const hour = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();
  const fullHour = `${hour}:${min}:${sec}`;

  return fullHour;
};

const periodFormat = (date) => {
  const hour = date.getHours();
  const period = (hour > 11 ? 'PM' : 'AM');
  return period;
};

const formatMessage = (chatMessage, nickname) => {
  const date = new Date();

  const fullDate = dateFormat(date);
  const fullHour = hourFormat(date);
  const period = periodFormat(date);

  const formatedMessage = `${fullDate} ${fullHour} ${period} - ${nickname}: ${chatMessage}`;

  return formatedMessage;
};

module.exports = formatMessage;
