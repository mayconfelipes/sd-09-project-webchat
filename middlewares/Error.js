const HTTP_ERR = 500;

module.exports = (err, _req, res, _next) => {
  res.status(HTTP_ERR).render('Error', { err: err.message });
};
