const express = require('express');
const router = express.Router();

const {
  createOvertimeRequest,
  getMyOvertimeRequests,
  getPendingOvertimeRequests,
  getAllOvertimeRequests,
  reviewOvertimeRequest,
  getOvertimeRequestById,
} = require('../controllers/overtimeController');

const { protect } = require('../middleware/authMiddleware');
const { managerOrAdmin, adminOnly } = require('../middleware/roleMiddleware');
const {
  overtimeRequestValidator,
  reviewOvertimeValidator,
} = require('../utils/validators');

// All routes require authentication
router.use(protect);

// Employee routes
router.post('/request', overtimeRequestValidator, createOvertimeRequest);
router.get('/my-requests', getMyOvertimeRequests);

// Manager + Admin routes
router.get('/pending', managerOrAdmin, getPendingOvertimeRequests);
router.patch('/:id/review', managerOrAdmin, reviewOvertimeValidator, reviewOvertimeRequest);

// Admin only
router.get('/all', adminOnly, getAllOvertimeRequests);

// Single request (with role-based access in controller)
router.get('/:id', getOvertimeRequestById);

module.exports = router;