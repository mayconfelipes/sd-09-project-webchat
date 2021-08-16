module.exports = () => {
  const data = new Date();
  const dia = data.getDate().toString().padStart(2, '0');
  const mes = (data.getMonth() + 1).toString().padStart(2, '0');
  const ano = data.getFullYear();
  const hours = data.getHours();
  const minutes = data.getMinutes();
  const seconds = data.getSeconds();
  return `${dia}-${mes}-${ano} ${hours}:${minutes}:${seconds}`;
};
