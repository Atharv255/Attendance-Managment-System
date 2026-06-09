const { errorResponse } = require('../utils/apiResponse');
const logger = require('../config/logger');

/**
 * Middleware to authorize specific roles
 * @param {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, 'Authentication required.');
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(
        `Authorization failed: User ${req.user.email} with role ${req.user.role} tried to access restricted resource. Required roles: ${roles.join(', ')}`
      );
      return errorResponse(
        res,
        403,
        `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`
      );
    }

    logger.debug(
      `Authorization successful: User ${req.user.email} has role ${req.user.role}`
    );
    next();
  };
};

/**
 * Middleware: Only Admin
 */
const adminOnly = authorize('admin');

/**
 * Middleware: Admin or Manager
 */
const managerOrAdmin = authorize('manager', 'admin');

/**
 * Middleware: All authenticated users
 */
const allRoles = authorize('employee', 'manager', 'admin');

module.exports = { authorize, adminOnly, managerOrAdmin, allRoles };