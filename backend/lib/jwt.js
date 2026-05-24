const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

if (!secret) {
  throw new Error('JWT_SECRET is required');
}

const signToken = (payload) => jwt.sign(payload, secret, { expiresIn });
const verifyToken = (token) => jwt.verify(token, secret);

module.exports = { signToken, verifyToken };
