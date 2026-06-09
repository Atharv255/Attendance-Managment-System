const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');
const {
  registerValidator,
  loginValidator,
} = require('../utils/validators');

// Public routes
router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;