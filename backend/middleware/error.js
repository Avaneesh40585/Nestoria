const { HttpError } = require('../lib/http');

// 404 for unmatched routes.
const notFoundHandler = (req, _res, next) => {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

// Central error handler. Express identifies it by the 4-argument signature.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: err.message || 'Internal server error',
    code: err.code,
  });
};

module.exports = { notFoundHandler, errorHandler };
