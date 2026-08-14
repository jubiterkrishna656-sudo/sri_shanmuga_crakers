const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getUser = async (req, res, decoded) => {
  const user = await User.findById(decoded.id).select('isBlocked role name');
  if (!user) return res.status(401).json({ error: 'Account not found' });
  if (user.isBlocked) return res.status(403).json({ error: 'Account blocked' });
  req.userId = user._id.toString();
  req.userName = user.name;
  req.userRole = user.role;
  return null;
};

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const error = await getUser(req, res, decoded);
    if (error) return error;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: err.message });
  }
};

const adminAuth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const error = await getUser(req, res, decoded);
    if (error) return error;
    if (req.userRole !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: err.message });
  }
};

// Same as auth, but only sets req.userId/userName/userRole when a valid token
// is supplied. Never rejects the request — used for optional guest flows.
const optionalAuth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('isBlocked role name');
    if (user && !user.isBlocked) {
      req.userId = user._id.toString();
      req.userName = user.name;
      req.userRole = user.role;
    }
  } catch {
    // invalid/expired token — treat as guest
  }
  next();
};

module.exports = { auth, adminAuth, optionalAuth };
