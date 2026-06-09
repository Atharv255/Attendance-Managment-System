const { verifyToken } = require('../utils/generateToken');
const User = require('../models/User');
const { errorResponse } = require('../utils/apiResponse');
const logger = require('../config/logger');

/**
 * Middleware to protect routes - verifies JWT token
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, 401, 'Access denied. No token provided.');
    }

    // Verify token
    const decoded = verifyToken(token);

    // Find user and attach to request
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return errorResponse(res, 401, 'Token is invalid. User not found.');
    }

    if (!user.isActive) {
      return errorResponse(
        res,
        401,
        'Your account has been deactivated. Please contact admin.'
      );
    }

    req.user = user;
    logger.debug(`Auth middleware: User ${user.email} authenticated`);
    next();
  } catch (error) {
    logger.error(`Auth middleware error: ${error.message}`);

    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 401, 'Invalid token.');
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Token has expired. Please login again.');
    }

    return errorResponse(res, 401, 'Authentication failed.');
  }
};

module.exports = { protect };