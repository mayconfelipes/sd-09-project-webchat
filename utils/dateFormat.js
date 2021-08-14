const date = new Date();
const dateFormat = ({ nickname, chatMessage }) => {
  const formDate = `${date.toLocaleDateString().replace(/\//g, '-')} ${date.toLocaleTimeString()}`;
  return {
    formDate,
    nickname, 
    chatMessage,
  };
};

module.exports = dateFormat;