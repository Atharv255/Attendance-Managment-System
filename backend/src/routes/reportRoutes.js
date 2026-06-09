const express = require('express');
const router = express.Router();

const {
  getDailyReport,
  getSummaryReport,
  getOvertimeReport,
  getEmployeeReport,
} = require('../controllers/reportController');

const { protect } = require('../middleware/authMiddleware');
const { managerOrAdmin } = require('../middleware/roleMiddleware');
const { reportQueryValidator } = require('../utils/validators');

// All routes require authentication
router.use(protect);

// All authenticated users (role-based filtering in controller)
router.get('/daily', reportQueryValidator, getDailyReport);
router.get('/employee/:userId', getEmployeeReport);

// Manager + Admin only
router.get('/summary', managerOrAdmin, getSummaryReport);
router.get('/overtime', managerOrAdmin, getOvertimeReport);

module.exports = router;