// Wrap an async controller so thrown errors flow to the central error middleware.
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

class HttpError extends Error {
  constructor(status, message, code) {
    super(message);
    this.status = status;
    if (code) this.code = code;
  }
}

const badRequest  = (msg, code) => new HttpError(400, msg, code);
const unauthorized = (msg = 'Not authenticated') => new HttpError(401, msg);
const forbidden    = (msg = 'Forbidden') => new HttpError(403, msg);
const notFound     = (msg = 'Not found') => new HttpError(404, msg);
const conflict     = (msg, code) => new HttpError(409, msg, code);

module.exports = { asyncHandler, HttpError, badRequest, unauthorized, forbidden, notFound, conflict };
