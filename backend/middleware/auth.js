const { verifyToken } = require('../lib/jwt');
const { unauthorized, forbidden } = require('../lib/http');

const authenticate = (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(unauthorized());
  try {
    req.user = verifyToken(token);  // { id, role, email }
    next();
  } catch (_err) {
    next(unauthorized('Token expired or invalid'));
  }
};

const requireRole = (role) => (req, _res, next) => {
  if (!req.user) return next(unauthorized());
  if (req.user.role !== role) return next(forbidden(`Requires ${role} role`));
  next();
};

const requireHost     = requireRole('host');
const requireCustomer = requireRole('customer');

module.exports = { authenticate, requireRole, requireHost, requireCustomer };
