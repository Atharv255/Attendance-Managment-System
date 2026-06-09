const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

/**
 * Generate JWT token for a user
 * @param {string} userId - User's MongoDB ID
 * @param {string} role - User's role
 * @returns {string} JWT token
 */
const generateToken = (userId, role) => {
  try {
    const token = jwt.sign(
      {
        id: userId,
        role: role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE || '7d',
      }
    );
    return token;
  } catch (error) {
    logger.error(`Token generation failed: ${error.message}`);
    throw new Error('Token generation failed');
  }
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    logger.error(`Token verification failed: ${error.message}`);
    throw error;
  }
};

module.exports = { generateToken, verifyToken };