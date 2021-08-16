const addZero = (numero) => {
  if (numero <= 9) return `0${numero}`;
  return numero; 
};

const getTime = () => {
  const currentDate = new Date();
  const traco = '-';
  const hour = currentDate.getHours();
  const minute = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  const espaco = ' ';
  const doisPontos = ':';
  const currentDateFormated = addZero(currentDate.getDate().toString())
  + traco + addZero(currentDate.getMonth() + 1).toString()
  + traco + currentDate.getFullYear() 
  + espaco + hour + doisPontos + addZero(minute.toString())
  + doisPontos + addZero(seconds.toString()); 
  return currentDateFormated;
};

const createMessage = (chatMessage, nickName) => {
  const date = getTime();
  return {
    message: `${date} ${nickName} ${chatMessage}`,
    timestamp: date,
};
};

const iD = () => `_${Math.random().toString(36).substr(2, 9)}`;

module.exports = {
  createMessage,
  iD,
};