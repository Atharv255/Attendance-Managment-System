const { body, query, param } = require('express-validator');

// Auth validators
const registerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),

  body('role')
    .optional()
    .isIn(['employee', 'manager', 'admin'])
    .withMessage('Role must be employee, manager, or admin'),

  body('department')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Department name cannot exceed 50 characters'),

  body('phone')
    .optional()
    .trim()
    .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
    .withMessage('Please provide a valid phone number'),
];

const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password').notEmpty().withMessage('Password is required'),
];

// Attendance validators
const punchInValidator = [
  body('latitude')
    .notEmpty()
    .withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),

  body('longitude')
    .notEmpty()
    .withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),

  body('address').optional().trim(),
];

const punchOutValidator = [
  body('latitude')
    .notEmpty()
    .withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),

  body('longitude')
    .notEmpty()
    .withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),

  body('address').optional().trim(),
];

// Validation validator
const validateAttendanceValidator = [
  body('validationStatus')
    .notEmpty()
    .withMessage('Validation status is required')
    .isIn(['valid', 'invalid'])
    .withMessage('Validation status must be valid or invalid'),

  body('remarks').optional().trim().isLength({ max: 500 }).withMessage('Remarks cannot exceed 500 characters'),
];

// Overtime validators
const overtimeRequestValidator = [
  body('attendanceId').notEmpty().withMessage('Attendance ID is required').isMongoId().withMessage('Invalid attendance ID'),

  body('requestedHours')
    .notEmpty()
    .withMessage('Requested hours are required')
    .isFloat({ min: 0.5, max: 6 })
    .withMessage('Overtime must be between 0.5 and 6 hours'),

  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Reason is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Reason must be between 10 and 500 characters'),
];

const reviewOvertimeValidator = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['approved', 'rejected'])
    .withMessage('Status must be approved or rejected'),

  body('reviewRemarks')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Remarks cannot exceed 500 characters'),
];

// Report validators
const reportQueryValidator = [
  query('startDate')
    .optional()
    .isDate()
    .withMessage('Start date must be a valid date (YYYY-MM-DD)'),

  query('endDate')
    .optional()
    .isDate()
    .withMessage('End date must be a valid date (YYYY-MM-DD)'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

module.exports = {
  registerValidator,
  loginValidator,
  punchInValidator,
  punchOutValidator,
  validateAttendanceValidator,
  overtimeRequestValidator,
  reviewOvertimeValidator,
  reportQueryValidator,
};