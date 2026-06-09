const Attendance = require('../models/Attendance');
const User = require('../models/User');
const OvertimeRequest = require('../models/OvertimeRequest');
const { successResponse, errorResponse, getPaginationMeta } = require('../utils/apiResponse');
const { getTodayDate, formatHours } = require('../utils/calculateHours');
const logger = require('../config/logger');

/**
 * @desc    Get daily attendance report
 * @route   GET /api/reports/daily
 * @access  Private
 */
const getDailyReport = async (req, res) => {
  const { date, page = 1, limit = 10 } = req.query;
  const reportDate = date || getTodayDate();
  const skip = (parseInt(page) - 1) * parseInt(limit);

  let userQuery = { isActive: true };
  let attendanceQuery = { date: reportDate };

  // Role-based filtering
  if (req.user.role === 'employee') {
    // Employee only sees their own
    attendanceQuery.userId = req.user._id;
  } else if (req.user.role === 'manager') {
    // Manager sees their team
    const teamMembers = await User.find({
      managerId: req.user._id,
      isActive: true,
    }).select('_id');
    const teamIds = teamMembers.map((m) => m._id);
    attendanceQuery.userId = { $in: teamIds };
  }
  // Admin sees all

  const [attendanceList, total] = await Promise.all([
    Attendance.find(attendanceQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email employeeId department phone')
      .populate('validatedBy', 'name email')
      .populate('overtimeRequestId'),
    Attendance.countDocuments(attendanceQuery),
  ]);

  // Format report data
  const reportData = attendanceList.map((record) => ({
    _id: record._id,
    employeeId: record.userId?.employeeId,
    employeeName: record.userId?.name,
    employeeEmail: record.userId?.email,
    department: record.userId?.department,
    date: record.date,
    punchInTime: record.punchIn?.time || null,
    punchOutTime: record.punchOut?.time || null,
    punchInSelfie: record.punchIn?.selfie?.url || null,
    punchOutSelfie: record.punchOut?.selfie?.url || null,
    punchInLocation: record.punchIn?.location || null,
    punchOutLocation: record.punchOut?.location || null,
    totalWorkingHours: record.totalWorkingHours,
    formattedHours: formatHours(record.totalWorkingHours),
    workingStatus: record.workingStatus,
    validationStatus: record.validationStatus,
    validatedBy: record.validatedBy?.name || null,
    remarks: record.remarks,
    overtimeRequested: record.overtimeRequested,
    overtimeHours: record.overtimeHours,
    isPunchedIn: record.isPunchedIn,
  }));

  const meta = {
    ...getPaginationMeta(parseInt(page), parseInt(limit), total),
    reportDate,
    generatedAt: new Date().toISOString(),
    generatedBy: req.user.name,
  };

  logger.info(
    `Daily report generated for date: ${reportDate} by user: ${req.user.email}`
  );

  return successResponse(res, 200, 'Daily attendance report generated', reportData, meta);
};

/**
 * @desc    Get attendance summary report
 * @route   GET /api/reports/summary
 * @access  Private (Manager, Admin)
 */
const getSummaryReport = async (req, res) => {
  const { startDate, endDate, userId } = req.query;

  if (!startDate || !endDate) {
    return errorResponse(res, 400, 'Start date and end date are required');
  }

  let query = {
    date: { $gte: startDate, $lte: endDate },
  };

  if (userId) {
    query.userId = userId;
  } else if (req.user.role === 'manager') {
    const teamMembers = await User.find({
      managerId: req.user._id,
      isActive: true,
    }).select('_id');
    const teamIds = teamMembers.map((m) => m._id);
    query.userId = { $in: teamIds };
  } else if (req.user.role === 'employee') {
    query.userId = req.user._id;
  }

  const attendanceList = await Attendance.find(query)
    .populate('userId', 'name email employeeId department')
    .sort({ date: -1 });

  // Group by user
  const summaryMap = {};

  attendanceList.forEach((record) => {
    const uid = record.userId._id.toString();
    if (!summaryMap[uid]) {
      summaryMap[uid] = {
        userId: uid,
        employeeId: record.userId.employeeId,
        name: record.userId.name,
        email: record.userId.email,
        department: record.userId.department,
        totalDays: 0,
        completedDays: 0,
        incompleteDays: 0,
        absentDays: 0,
        totalWorkingHours: 0,
        totalOvertimeHours: 0,
        validAttendance: 0,
        invalidAttendance: 0,
        pendingValidation: 0,
      };
    }

    summaryMap[uid].totalDays++;
    summaryMap[uid].totalWorkingHours += record.totalWorkingHours || 0;
    summaryMap[uid].totalOvertimeHours += record.overtimeHours || 0;

    if (record.workingStatus === 'completed') summaryMap[uid].completedDays++;
    else if (record.workingStatus === 'incomplete') summaryMap[uid].incompleteDays++;
    else if (record.workingStatus === 'absent') summaryMap[uid].absentDays++;

    if (record.validationStatus === 'valid') summaryMap[uid].validAttendance++;
    else if (record.validationStatus === 'invalid') summaryMap[uid].invalidAttendance++;
    else summaryMap[uid].pendingValidation++;
  });

  // Round hours
  const summary = Object.values(summaryMap).map((item) => ({
    ...item,
    totalWorkingHours: Math.round(item.totalWorkingHours * 100) / 100,
    totalOvertimeHours: Math.round(item.totalOvertimeHours * 100) / 100,
    formattedTotalHours: formatHours(item.totalWorkingHours),
  }));

  return successResponse(res, 200, 'Summary report generated', summary, {
    startDate,
    endDate,
    generatedAt: new Date().toISOString(),
    generatedBy: req.user.name,
  });
};

/**
 * @desc    Get overtime report
 * @route   GET /api/reports/overtime
 * @access  Private (Manager, Admin)
 */
const getOvertimeReport = async (req, res) => {
  const { startDate, endDate, status, page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  let query = {};

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = startDate;
    if (endDate) query.date.$lte = endDate;
  }

  if (status) query.status = status;

  if (req.user.role === 'manager') {
    const teamMembers = await User.find({
      managerId: req.user._id,
      isActive: true,
    }).select('_id');
    const teamIds = teamMembers.map((m) => m._id);
    query.userId = { $in: teamIds };
  } else if (req.user.role === 'employee') {
    query.userId = req.user._id;
  }

  const [overtimeList, total] = await Promise.all([
    OvertimeRequest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email employeeId department')
      .populate('reviewedBy', 'name email'),
    OvertimeRequest.countDocuments(query),
  ]);

  const meta = {
    ...getPaginationMeta(parseInt(page), parseInt(limit), total),
    generatedAt: new Date().toISOString(),
    generatedBy: req.user.name,
  };

  return successResponse(res, 200, 'Overtime report generated', overtimeList, meta);
};

/**
 * @desc    Get individual employee full report
 * @route   GET /api/reports/employee/:userId
 * @access  Private
 */
const getEmployeeReport = async (req, res) => {
  const { userId } = req.params;
  const { startDate, endDate } = req.query;

  // Authorization
  if (req.user.role === 'employee' && userId !== req.user._id.toString()) {
    return errorResponse(res, 403, 'You can only view your own report');
  }

  if (req.user.role === 'manager') {
    const isMember = await User.findOne({
      _id: userId,
      managerId: req.user._id,
    });
    if (!isMember) {
      return errorResponse(res, 403, 'This employee is not in your team');
    }
  }

  const user = await User.findById(userId).select('-password').populate('managerId', 'name email');
  if (!user) {
    return errorResponse(res, 404, 'Employee not found');
  }

  const attendanceQuery = { userId };
  if (startDate || endDate) {
    attendanceQuery.date = {};
    if (startDate) attendanceQuery.date.$gte = startDate;
    if (endDate) attendanceQuery.date.$lte = endDate;
  }

  const [attendanceList, overtimeList] = await Promise.all([
    Attendance.find(attendanceQuery)
      .sort({ date: -1 })
      .populate('validatedBy', 'name email')
      .populate('overtimeRequestId'),
    OvertimeRequest.find({ userId })
      .sort({ createdAt: -1 })
      .populate('reviewedBy', 'name email'),
  ]);

  // Calculate summary
  const totalDays = attendanceList.length;
  const completedDays = attendanceList.filter((a) => a.workingStatus === 'completed').length;
  const totalHours = attendanceList.reduce((sum, a) => sum + (a.totalWorkingHours || 0), 0);
  const totalOT = attendanceList.reduce((sum, a) => sum + (a.overtimeHours || 0), 0);

  const report = {
    employee: user,
    summary: {
      totalDays,
      completedDays,
      incompleteDays: totalDays - completedDays,
      totalWorkingHours: Math.round(totalHours * 100) / 100,
      formattedTotalHours: formatHours(totalHours),
      totalOvertimeHours: Math.round(totalOT * 100) / 100,
      averageHoursPerDay: totalDays > 0 ? Math.round((totalHours / totalDays) * 100) / 100 : 0,
    },
    attendanceRecords: attendanceList,
    overtimeRequests: overtimeList,
  };

  logger.info(
    `Employee report generated for ${user.email} by ${req.user.email}`
  );

  return successResponse(res, 200, 'Employee report generated', report);
};

module.exports = {
  getDailyReport,
  getSummaryReport,
  getOvertimeReport,
  getEmployeeReport,
};