const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('🔐 Auth check - Token present:', !!token, 'Path:', req.path);

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('❌ Token verification failed:', err.message);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    console.log('✅ Auth successful - User:', user.id, 'Role:', user.role);
    next();
  });
};

const authorizeHost = (req, res, next) => {
  if (req.user.role !== 'host') {
    return res.status(403).json({ error: 'Host authorization required' });
  }
  next();
};

const isCustomer = (req, res, next) => {
  if (req.user.role !== 'customer') {
    return res.status(403).json({ error: 'Customer authorization required' });
  }
  next();
};

module.exports = { authenticateToken, authorizeHost, isCustomer };
