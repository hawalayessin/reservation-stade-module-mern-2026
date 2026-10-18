const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  let decoded;
  try {
    decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET, { algorithms: ['HS256'] });
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
  try {
    // Read privileges from the database, never from a stale token or request body.
    const user = await User.findById(decoded.userId).select('_id isAdmin');
    if (!user) return res.status(401).json({ message: 'Account not found' });
    req.userId = String(user._id);
    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.isAdmin !== true) {
    return res.status(403).json({ message: 'Administrator access required' });
  }
  return next();
};

module.exports = { protect, adminOnly };
