const { validationResult } = require('express-validator');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const { successResponse, errorResponse, getPaginationMeta } = require('../utils/apiResponse');
const logger = require('../config/logger');

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private (Admin)
 */
const getAllUsers = async (req, res) => {
  const { page = 1, limit = 10, role, department, isActive, search } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build query
  const query = {};
  if (role) query.role = role;
  if (department) query.department = department;
  if (isActive !== undefined) query.isActive = isActive === 'true';
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { employeeId: { $regex: search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('managerId', 'name email'),
    User.countDocuments(query),
  ]);

  const meta = getPaginationMeta(parseInt(page), parseInt(limit), total);

  return successResponse(res, 200, 'Users fetched successfully', users, meta);
};

/**
 * @desc    Get team members (for manager)
 * @route   GET /api/users/team
 * @access  Private (Manager)
 */
const getTeamMembers = async (req, res) => {
  const teamMembers = await User.find({
    managerId: req.user._id,
    isActive: true,
  })
    .select('-password')
    .sort({ name: 1 });

  return successResponse(res, 200, 'Team members fetched', teamMembers);
};

/**
 * @desc    Get single user by ID
 * @route   GET /api/users/:id
 * @access  Private (Admin, Manager - own team)
 */
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password')
    .populate('managerId', 'name email department');

  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  // Manager can only view their team
  if (req.user.role === 'manager') {
    if (
      user._id.toString() !== req.user._id.toString() &&
      (!user.managerId || user.managerId._id.toString() !== req.user._id.toString())
    ) {
      return errorResponse(res, 403, 'Access denied. Not your team member.');
    }
  }

  return successResponse(res, 200, 'User fetched successfully', { user });
};

/**
 * @desc    Update user (Admin only)
 * @route   PUT /api/users/:id
 * @access  Private (Admin)
 */
const updateUser = async (req, res) => {
  const { name, email, role, department, phone, managerId, isActive } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  // Check if email is being changed to existing email
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 400, 'Email already in use');
    }
  }

  // Validate manager if provided
  if (managerId) {
    const manager = await User.findById(managerId);
    if (!manager || !['manager', 'admin'].includes(manager.role)) {
      return errorResponse(res, 400, 'Invalid manager ID');
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      ...(name && { name }),
      ...(email && { email }),
      ...(role && { role }),
      ...(department && { department }),
      ...(phone && { phone }),
      ...(managerId !== undefined && { managerId }),
      ...(isActive !== undefined && { isActive }),
    },
    { new: true, runValidators: true }
  ).select('-password');

  logger.info(`User updated: ${updatedUser.email} by admin ${req.user.email}`);

  return successResponse(res, 200, 'User updated successfully', { user: updatedUser });
};

/**
 * @desc    Delete/Deactivate user (Admin only)
 * @route   DELETE /api/users/:id
 * @access  Private (Admin)
 */
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  // Prevent deleting yourself
  if (user._id.toString() === req.user._id.toString()) {
    return errorResponse(res, 400, 'You cannot delete your own account');
  }

  // Soft delete - deactivate instead of actually deleting
  user.isActive = false;
  await user.save();

  logger.info(`User deactivated: ${user.email} by admin ${req.user.email}`);

  return successResponse(res, 200, 'User deactivated successfully');
};

/**
 * @desc    Get all managers (for assigning to employees)
 * @route   GET /api/users/managers
 * @access  Private (Admin)
 */
const getManagers = async (req, res) => {
  const managers = await User.find({
    role: { $in: ['manager', 'admin'] },
    isActive: true,
  })
    .select('name email department employeeId role')
    .sort({ name: 1 });

  return successResponse(res, 200, 'Managers fetched successfully', managers);
};

/**
 * @desc    Activate user (Admin only)
 * @route   PATCH /api/users/:id/activate
 * @access  Private (Admin)
 */
const activateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: true },
    { new: true }
  ).select('-password');

  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  logger.info(`User activated: ${user.email} by admin ${req.user.email}`);

  return successResponse(res, 200, 'User activated successfully', { user });
};

module.exports = {
  getAllUsers,
  getTeamMembers,
  getUserById,
  updateUser,
  deleteUser,
  getManagers,
  activateUser,
};