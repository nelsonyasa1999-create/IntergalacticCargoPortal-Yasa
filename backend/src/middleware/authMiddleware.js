const { verifyToken } = require('../utils/jwt');

const CLEARANCE_ERROR = 'Clearance level inadequate.';

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Authentication required.',
    });
  }

  const token = authHeader.slice(7);

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({
      message: 'Invalid or expired token.',
    });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({
      message: CLEARANCE_ERROR,
    });
  }
  next();
}

module.exports = { authenticate, requireAdmin, CLEARANCE_ERROR };
