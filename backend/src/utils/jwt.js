const jwt = require('jsonwebtoken');

const JWT_EXPIRES_IN = '24h';

function signToken(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign(payload, secret, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.verify(token, secret);
}

module.exports = { signToken, verifyToken, JWT_EXPIRES_IN };
