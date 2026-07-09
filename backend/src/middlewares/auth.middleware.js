import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Protect Routes from unauthenticated requests
export const protect = async (req, res, next) => {
  let token;

  // Read token from cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ status: 'fail', message: 'Not authorized to access this resource' });
  }

  try {
    // Verify token payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to the request object
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({ status: 'fail', message: 'Not authorized, token verification failed' });
  }
};

// Restrict access based on Role-Based Access Control (RBAC)
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: `User role '${req.user.role}' is unauthorized to access this action`,
      });
    }
    next();
  };
};