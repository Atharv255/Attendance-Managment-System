const express = require('express');
const router = express.Router();

const {
  punchIn,
  punchOut,
  getTodayAttendance,
  getMyAttendance,
  getAllAttendance,
  getTeamAttendance,
  getAttendanceById,
  validateAttendance,
  getDashboardStats,
} = require('../controllers/attendanceController');

const { protect } = require('../middleware/authMiddleware');
const { authorize, managerOrAdmin, adminOnly } = require('../middleware/roleMiddleware');
const { selfieUpload } = require('../middleware/uploadMiddleware');
const {
  punchInValidator,
  punchOutValidator,
  validateAttendanceValidator,
} = require('../utils/validators');

// All routes require authentication
router.use(protect);

// Employee routes
router.post('/punch-in', selfieUpload, punchInValidator, punchIn);
router.post('/punch-out', selfieUpload, punchOutValidator, punchOut);
router.get('/today', getTodayAttendance);
router.get('/my-attendance', getMyAttendance);

// Dashboard stats (all roles)
router.get('/dashboard/stats', getDashboardStats);

// Manager + Admin routes
router.get('/team', managerOrAdmin, getTeamAttendance);
router.patch('/:id/validate', managerOrAdmin, validateAttendanceValidator, validateAttendance);

// Admin only routes
router.get('/all', adminOnly, getAllAttendance);

// Single record (with role-based access in controller)
router.get('/:id', getAttendanceById);

module.exports = router;