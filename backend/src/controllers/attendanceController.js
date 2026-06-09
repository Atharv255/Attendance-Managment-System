const { validationResult } = require('express-validator');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { successResponse, errorResponse, getPaginationMeta } = require('../utils/apiResponse');
const { getTodayDate, calculateWorkingHours, getWorkingStatus } = require('../utils/calculateHours');
const logger = require('../config/logger');

/**
 * @desc    Punch In
 * @route   POST /api/attendance/punch-in
 * @access  Private (Employee)
 */
const punchIn = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 400, 'Validation Error', errors.array());
  }

  const { latitude, longitude, address } = req.body;
  const today = getTodayDate();

  // Check if already punched in today
  const existingAttendance = await Attendance.findOne({
    userId: req.user._id,
    date: today,
  });

  if (existingAttendance && existingAttendance.isPunchedIn) {
    return errorResponse(res, 400, 'You have already punched in today. Please punch out first.');
  }

  if (existingAttendance && existingAttendance.punchOut.time) {
    return errorResponse(res, 400, 'You have already completed attendance for today.');
  }

  // Check if selfie was uploaded
  if (!req.file) {
    return errorResponse(res, 400, 'Selfie is required for punch in');
  }

  const selfieUrl = req.file.path;
  const selfiePublicId = req.file.filename;

  let attendance;

  if (existingAttendance) {
    // Update existing record
    existingAttendance.punchIn = {
      time: new Date(),
      selfie: { url: selfieUrl, publicId: selfiePublicId },
      location: { latitude: parseFloat(latitude), longitude: parseFloat(longitude), address },
    };
    existingAttendance.isPunchedIn = true;
    existingAttendance.validationStatus = 'pending';
    attendance = await existingAttendance.save();
  } else {
    // Create new attendance record
    attendance = await Attendance.create({
      userId: req.user._id,
      date: today,
      punchIn: {
        time: new Date(),
        selfie: { url: selfieUrl, publicId: selfiePublicId },
        location: { latitude: parseFloat(latitude), longitude: parseFloat(longitude), address },
      },
      isPunchedIn: true,
      validationStatus: 'pending',
    });
  }

  logger.info(`Punch In: User ${req.user.email} punched in at ${new Date().toISOString()}`);

  return successResponse(res, 200, 'Punched in successfully', { attendance });
};

/**
 * @desc    Punch Out
 * @route   POST /api/attendance/punch-out
 * @access  Private (Employee)
 */
const punchOut = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 400, 'Validation Error', errors.array());
  }

  const { latitude, longitude, address } = req.body;
  const today = getTodayDate();

  // Find today's attendance
  const attendance = await Attendance.findOne({
    userId: req.user._id,
    date: today,
  });

  if (!attendance) {
    return errorResponse(res, 400, 'No punch in record found for today. Please punch in first.');
  }

  if (!attendance.isPunchedIn) {
    return errorResponse(res, 400, 'You have not punched in today. Please punch in first.');
  }

  if (attendance.punchOut.time) {
    return errorResponse(res, 400, 'You have already punched out today.');
  }

  // Check if selfie was uploaded
  if (!req.file) {
    return errorResponse(res, 400, 'Selfie is required for punch out');
  }

  const selfieUrl = req.file.path;
  const selfiePublicId = req.file.filename;
  const punchOutTime = new Date();

  // Calculate working hours
  const totalHours = calculateWorkingHours(attendance.punchIn.time, punchOutTime);
  const workingStatus = getWorkingStatus(totalHours);

  // Update attendance
  attendance.punchOut = {
    time: punchOutTime,
    selfie: { url: selfieUrl, publicId: selfiePublicId },
    location: { latitude: parseFloat(latitude), longitude: parseFloat(longitude), address },
  };
  attendance.totalWorkingHours = totalHours;
  attendance.workingStatus = workingStatus;
  attendance.isPunchedIn = false;

  await attendance.save();

  logger.info(
    `Punch Out: User ${req.user.email} punched out. Total hours: ${totalHours}`
  );

  return successResponse(res, 200, 'Punched out successfully', { attendance });
};

/**
 * @desc    Get today's attendance for logged in employee
 * @route   GET /api/attendance/today
 * @access  Private
 */
const getTodayAttendance = async (req, res) => {
  const today = getTodayDate();

  const attendance = await Attendance.findOne({
    userId: req.user._id,
    date: today,
  }).populate('userId', 'name email employeeId department');

  return successResponse(res, 200, 'Today attendance fetched', {
    attendance: attendance || null,
    today,
  });
};

/**
 * @desc    Get attendance history for logged in employee
 * @route   GET /api/attendance/my-attendance
 * @access  Private (Employee)
 */
const getMyAttendance = async (req, res) => {
  const { page = 1, limit = 10, startDate, endDate } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build query
  const query = { userId: req.user._id };

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = startDate;
    if (endDate) query.date.$lte = endDate;
  }

  const [attendanceList, total] = await Promise.all([
    Attendance.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('overtimeRequestId')
      .populate('validatedBy', 'name email'),
    Attendance.countDocuments(query),
  ]);

  const meta = getPaginationMeta(parseInt(page), parseInt(limit), total);

  return successResponse(res, 200, 'Attendance history fetched', attendanceList, meta);
};

/**
 * @desc    Get all attendance (Admin only)
 * @route   GET /api/attendance/all
 * @access  Private (Admin)
 */
const getAllAttendance = async (req, res) => {
  const { page = 1, limit = 10, startDate, endDate, userId, validationStatus } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build query
  const query = {};
  if (userId) query.userId = userId;
  if (validationStatus) query.validationStatus = validationStatus;
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = startDate;
    if (endDate) query.date.$lte = endDate;
  }

  const [attendanceList, total] = await Promise.all([
    Attendance.find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email employeeId department role')
      .populate('validatedBy', 'name email')
      .populate('overtimeRequestId'),
    Attendance.countDocuments(query),
  ]);

  const meta = getPaginationMeta(parseInt(page), parseInt(limit), total);

  return successResponse(res, 200, 'All attendance fetched', attendanceList, meta);
};

/**
 * @desc    Get team attendance (Manager)
 * @route   GET /api/attendance/team
 * @access  Private (Manager, Admin)
 */
const getTeamAttendance = async (req, res) => {
  const { page = 1, limit = 10, startDate, endDate, validationStatus } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Find team members
  let teamMemberIds;

  if (req.user.role === 'admin') {
    // Admin sees all users
    const users = await User.find({ isActive: true }).select('_id');
    teamMemberIds = users.map((u) => u._id);
  } else {
    // Manager sees their team
    const teamMembers = await User.find({
      managerId: req.user._id,
      isActive: true,
    }).select('_id');
    teamMemberIds = teamMembers.map((m) => m._id);
  }

  // Build query
  const query = { userId: { $in: teamMemberIds } };
  if (validationStatus) query.validationStatus = validationStatus;
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = startDate;
    if (endDate) query.date.$lte = endDate;
  }

  const [attendanceList, total] = await Promise.all([
    Attendance.find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email employeeId department')
      .populate('validatedBy', 'name email')
      .populate('overtimeRequestId'),
    Attendance.countDocuments(query),
  ]);

  const meta = getPaginationMeta(parseInt(page), parseInt(limit), total);

  return successResponse(res, 200, 'Team attendance fetched', attendanceList, meta);
};

/**
 * @desc    Get single attendance record
 * @route   GET /api/attendance/:id
 * @access  Private
 */
const getAttendanceById = async (req, res) => {
  const attendance = await Attendance.findById(req.params.id)
    .populate('userId', 'name email employeeId department role managerId')
    .populate('validatedBy', 'name email role')
    .populate('overtimeRequestId');

  if (!attendance) {
    return errorResponse(res, 404, 'Attendance record not found');
  }

  // Authorization check: employee can only see their own
  if (
    req.user.role === 'employee' &&
    attendance.userId._id.toString() !== req.user._id.toString()
  ) {
    return errorResponse(res, 403, 'You are not authorized to view this record');
  }

  // Manager can only see their team members
  if (req.user.role === 'manager') {
    const teamMember = await User.findOne({
      _id: attendance.userId._id,
      managerId: req.user._id,
    });
    if (!teamMember) {
      return errorResponse(res, 403, 'You are not authorized to view this record');
    }
  }

  return successResponse(res, 200, 'Attendance record fetched', { attendance });
};

/**
 * @desc    Validate attendance (Admin/Manager)
 * @route   PATCH /api/attendance/:id/validate
 * @access  Private (Manager, Admin)
 */
const validateAttendance = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 400, 'Validation Error', errors.array());
  }

  const { validationStatus, remarks } = req.body;

  const attendance = await Attendance.findById(req.params.id).populate(
    'userId',
    'name email managerId'
  );

  if (!attendance) {
    return errorResponse(res, 404, 'Attendance record not found');
  }

  // Manager can only validate their team members
  if (req.user.role === 'manager') {
    const isTeamMember =
      attendance.userId.managerId &&
      attendance.userId.managerId.toString() === req.user._id.toString();

    if (!isTeamMember) {
      return errorResponse(
        res,
        403,
        'You can only validate attendance of your team members'
      );
    }
  }

  // Update validation status
  attendance.validationStatus = validationStatus;
  attendance.validatedBy = req.user._id;
  attendance.validatedAt = new Date();
  if (remarks) attendance.remarks = remarks;

  await attendance.save();

  logger.info(
    `Attendance validated: ID ${attendance._id} marked as ${validationStatus} by ${req.user.email}`
  );

  return successResponse(res, 200, `Attendance marked as ${validationStatus}`, {
    attendance,
  });
};

/**
 * @desc    Get attendance dashboard stats
 * @route   GET /api/attendance/dashboard/stats
 * @access  Private
 */
const getDashboardStats = async (req, res) => {
  const today = getTodayDate();
  const thisMonth = today.substring(0, 7); // YYYY-MM

  let stats = {};

  if (req.user.role === 'employee') {
    // Employee stats
    const [todayAttendance, monthlyAttendance] = await Promise.all([
      Attendance.findOne({ userId: req.user._id, date: today }),
      Attendance.find({
        userId: req.user._id,
        date: { $regex: `^${thisMonth}` },
      }),
    ]);

    const completedDays = monthlyAttendance.filter(
      (a) => a.workingStatus === 'completed'
    ).length;
    const totalWorkingHours = monthlyAttendance.reduce(
      (sum, a) => sum + (a.totalWorkingHours || 0),
      0
    );

    stats = {
      todayAttendance: todayAttendance || null,
      monthlyStats: {
        totalDays: monthlyAttendance.length,
        completedDays,
        incompleteDays: monthlyAttendance.length - completedDays,
        totalWorkingHours: Math.round(totalWorkingHours * 100) / 100,
      },
    };
  } else if (req.user.role === 'manager') {
    // Manager stats
    const teamMembers = await User.find({
      managerId: req.user._id,
      isActive: true,
    }).select('_id');
    const teamIds = teamMembers.map((m) => m._id);

    const [todayAttendance, pendingValidations, monthlyTeamAttendance] =
      await Promise.all([
        Attendance.find({ userId: { $in: teamIds }, date: today }).populate(
          'userId',
          'name email'
        ),
        Attendance.countDocuments({
          userId: { $in: teamIds },
          validationStatus: 'pending',
        }),
        Attendance.find({
          userId: { $in: teamIds },
          date: { $regex: `^${thisMonth}` },
        }),
      ]);

    stats = {
      teamSize: teamMembers.length,
      todayPresent: todayAttendance.length,
      todayAbsent: teamMembers.length - todayAttendance.length,
      pendingValidations,
      monthlyTeamAttendance: monthlyTeamAttendance.length,
    };
  } else if (req.user.role === 'admin') {
    // Admin stats
    const [
      totalUsers,
      todayAttendance,
      pendingValidations,
      totalAttendanceThisMonth,
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Attendance.countDocuments({ date: today }),
      Attendance.countDocuments({ validationStatus: 'pending' }),
      Attendance.countDocuments({ date: { $regex: `^${thisMonth}` } }),
    ]);

    const usersByRole = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    stats = {
      totalUsers,
      todayAttendance,
      todayAbsent: totalUsers - todayAttendance,
      pendingValidations,
      totalAttendanceThisMonth,
      usersByRole: usersByRole.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    };
  }

  return successResponse(res, 200, 'Dashboard stats fetched', { stats });
};

module.exports = {
  punchIn,
  punchOut,
  getTodayAttendance,
  getMyAttendance,
  getAllAttendance,
  getTeamAttendance,
  getAttendanceById,
  validateAttendance,
  getDashboardStats,
};