const { validationResult } = require('express-validator');
const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const logger = require('../config/logger');

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 400, 'Validation Error', errors.array());
  }

  const { name, email, password, role, department, phone, managerId } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return errorResponse(res, 400, 'User with this email already exists');
  }

  // If role is employee and managerId provided, validate manager
  if (managerId) {
    const manager = await User.findById(managerId);
    if (!manager || !['manager', 'admin'].includes(manager.role)) {
      return errorResponse(res, 400, 'Invalid manager ID');
    }
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'employee',
    department: department || 'General',
    phone,
    managerId: managerId || null,
  });

  // Generate token
  const token = generateToken(user._id, user.role);

  logger.info(`New user registered: ${user.email} with role: ${user.role}`);

  return successResponse(res, 201, 'User registered successfully', {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      employeeId: user.employeeId,
      phone: user.phone,
      managerId: user.managerId,
      isActive: user.isActive,
      createdAt: user.createdAt,
    },
  });
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 400, 'Validation Error', errors.array());
  }

  const { email, password } = req.body;

  // Find user with password
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return errorResponse(res, 401, 'Invalid email or password');
  }

  // Check if account is active
  if (!user.isActive) {
    return errorResponse(
      res,
      401,
      'Your account has been deactivated. Please contact admin.'
    );
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    logger.warn(`Failed login attempt for email: ${email}`);
    return errorResponse(res, 401, 'Invalid email or password');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Generate token
  const token = generateToken(user._id, user.role);

  logger.info(`User logged in: ${user.email}`);

  return successResponse(res, 200, 'Login successful', {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      employeeId: user.employeeId,
      phone: user.phone,
      managerId: user.managerId,
      profileImage: user.profileImage,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
    },
  });
};

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    'managerId',
    'name email department'
  );

  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  logger.debug(`Get profile: ${user.email}`);

  return successResponse(res, 200, 'Profile fetched successfully', { user });
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/update-profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  const { name, phone, department } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(department && { department }),
    },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return errorResponse(res, 404, 'User not found');
  }

  logger.info(`User profile updated: ${updatedUser.email}`);

  return successResponse(res, 200, 'Profile updated successfully', {
    user: updatedUser,
  });
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return errorResponse(res, 400, 'Current password and new password are required');
  }

  if (newPassword.length < 6) {
    return errorResponse(res, 400, 'New password must be at least 6 characters');
  }

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return errorResponse(res, 400, 'Current password is incorrect');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  logger.info(`Password changed for user: ${user.email}`);

  return successResponse(res, 200, 'Password changed successfully');
};

module.exports = { register, login, getMe, updateProfile, changePassword };