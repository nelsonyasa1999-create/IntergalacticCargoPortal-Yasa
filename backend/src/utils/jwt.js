const jwt = require('jsonwebtoken');

const JWT_EXPIRES_IN = '24h';

function signToken(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign(payload, secret, { expiresIn: JWT_EXPIRES_IN });
}

module.exports = { signToken, JWT_EXPIRES_IN };
