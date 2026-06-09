const { validationResult } = require('express-validator');
const OvertimeRequest = require('../models/OvertimeRequest');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { successResponse, errorResponse, getPaginationMeta } = require('../utils/apiResponse');
const { getTodayDate } = require('../utils/calculateHours');
const logger = require('../config/logger');

/**
 * @desc    Create overtime request
 * @route   POST /api/overtime/request
 * @access  Private (Employee)
 */
const createOvertimeRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 400, 'Validation Error', errors.array());
  }

  const { attendanceId, requestedHours, reason } = req.body;

  // Find attendance record
  const attendance = await Attendance.findById(attendanceId);
  if (!attendance) {
    return errorResponse(res, 404, 'Attendance record not found');
  }

  // Verify attendance belongs to requesting user
  if (attendance.userId.toString() !== req.user._id.toString()) {
    return errorResponse(res, 403, 'You can only request overtime for your own attendance');
  }

  // Check if punch out is done
  if (!attendance.punchOut.time) {
    return errorResponse(res, 400, 'Please punch out before requesting overtime');
  }

  // Check if overtime already requested for this day
  if (attendance.overtimeRequested) {
    return errorResponse(res, 400, 'Overtime already requested for this attendance record');
  }

  // Create overtime request
  const overtimeRequest = await OvertimeRequest.create({
    userId: req.user._id,
    attendanceId,
    date: attendance.date,
    requestedHours: parseFloat(requestedHours),
    reason,
    managerId: req.user.managerId || null,
    status: 'pending',
  });

  // Update attendance to mark overtime as requested
  attendance.overtimeRequested = true;
  attendance.overtimeRequestId = overtimeRequest._id;
  await attendance.save();

  logger.info(
    `Overtime requested: User ${req.user.email} requested ${requestedHours} hours OT for ${attendance.date}`
  );

  return successResponse(res, 201, 'Overtime request submitted successfully', {
    overtimeRequest,
  });
};

/**
 * @desc    Get my overtime requests
 * @route   GET /api/overtime/my-requests
 * @access  Private (Employee)
 */
const getMyOvertimeRequests = async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const query = { userId: req.user._id };
  if (status) query.status = status;

  const [requests, total] = await Promise.all([
    OvertimeRequest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('attendanceId', 'date punchIn punchOut totalWorkingHours')
      .populate('reviewedBy', 'name email'),
    OvertimeRequest.countDocuments(query),
  ]);

  const meta = getPaginationMeta(parseInt(page), parseInt(limit), total);

  return successResponse(res, 200, 'Overtime requests fetched', requests, meta);
};

/**
 * @desc    Get pending overtime requests for manager
 * @route   GET /api/overtime/pending
 * @access  Private (Manager, Admin)
 */
const getPendingOvertimeRequests = async (req, res) => {
  const { page = 1, limit = 10, status = 'pending' } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  let query = { status };

  if (req.user.role === 'manager') {
    // Get manager's team members
    const teamMembers = await User.find({
      managerId: req.user._id,
      isActive: true,
    }).select('_id');
    const teamIds = teamMembers.map((m) => m._id);
    query.userId = { $in: teamIds };
  }
  // Admin sees all requests

  const [requests, total] = await Promise.all([
    OvertimeRequest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email employeeId department')
      .populate('attendanceId', 'date punchIn punchOut totalWorkingHours')
      .populate('reviewedBy', 'name email'),
    OvertimeRequest.countDocuments(query),
  ]);

  const meta = getPaginationMeta(parseInt(page), parseInt(limit), total);

  return successResponse(res, 200, 'Overtime requests fetched', requests, meta);
};

/**
 * @desc    Get all overtime requests (Admin)
 * @route   GET /api/overtime/all
 * @access  Private (Admin)
 */
const getAllOvertimeRequests = async (req, res) => {
  const { page = 1, limit = 10, status, userId } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const query = {};
  if (status) query.status = status;
  if (userId) query.userId = userId;

  const [requests, total] = await Promise.all([
    OvertimeRequest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email employeeId department')
      .populate('attendanceId', 'date punchIn punchOut totalWorkingHours')
      .populate('reviewedBy', 'name email role'),
    OvertimeRequest.countDocuments(query),
  ]);

  const meta = getPaginationMeta(parseInt(page), parseInt(limit), total);

  return successResponse(res, 200, 'All overtime requests fetched', requests, meta);
};

/**
 * @desc    Review overtime request (Approve/Reject)
 * @route   PATCH /api/overtime/:id/review
 * @access  Private (Manager, Admin)
 */
const reviewOvertimeRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 400, 'Validation Error', errors.array());
  }

  const { status, reviewRemarks } = req.body;

  const overtimeRequest = await OvertimeRequest.findById(req.params.id).populate(
    'userId',
    'name email managerId'
  );

  if (!overtimeRequest) {
    return errorResponse(res, 404, 'Overtime request not found');
  }

  // Check if already reviewed
  if (overtimeRequest.status !== 'pending') {
    return errorResponse(
      res,
      400,
      `This overtime request has already been ${overtimeRequest.status}`
    );
  }

  // Manager can only review their team's requests
  if (req.user.role === 'manager') {
    const isTeamMember =
      overtimeRequest.userId.managerId &&
      overtimeRequest.userId.managerId.toString() === req.user._id.toString();

    if (!isTeamMember) {
      return errorResponse(
        res,
        403,
        'You can only review overtime requests from your team members'
      );
    }
  }

  // Update overtime request
  overtimeRequest.status = status;
  overtimeRequest.reviewedBy = req.user._id;
  overtimeRequest.reviewedAt = new Date();
  if (reviewRemarks) overtimeRequest.reviewRemarks = reviewRemarks;

  await overtimeRequest.save();

  // Update attendance record
  const attendance = await Attendance.findById(overtimeRequest.attendanceId);
  if (attendance) {
    if (status === 'approved') {
      attendance.overtimeHours = overtimeRequest.requestedHours;
    }
    await attendance.save();
  }

  logger.info(
    `Overtime ${status}: Request ID ${overtimeRequest._id} ${status} by ${req.user.email}`
  );

  return successResponse(
    res,
    200,
    `Overtime request ${status} successfully`,
    { overtimeRequest }
  );
};

/**
 * @desc    Get single overtime request
 * @route   GET /api/overtime/:id
 * @access  Private
 */
const getOvertimeRequestById = async (req, res) => {
  const overtimeRequest = await OvertimeRequest.findById(req.params.id)
    .populate('userId', 'name email employeeId department')
    .populate('attendanceId')
    .populate('reviewedBy', 'name email role')
    .populate('managerId', 'name email');

  if (!overtimeRequest) {
    return errorResponse(res, 404, 'Overtime request not found');
  }

  // Authorization
  if (
    req.user.role === 'employee' &&
    overtimeRequest.userId._id.toString() !== req.user._id.toString()
  ) {
    return errorResponse(res, 403, 'Access denied');
  }

  return successResponse(res, 200, 'Overtime request fetched', { overtimeRequest });
};

module.exports = {
  createOvertimeRequest,
  getMyOvertimeRequests,
  getPendingOvertimeRequests,
  getAllOvertimeRequests,
  reviewOvertimeRequest,
  getOvertimeRequestById,
};