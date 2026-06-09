const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getTeamMembers,
  getUserById,
  updateUser,
  deleteUser,
  getManagers,
  activateUser,
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');
const { adminOnly, managerOrAdmin } = require('../middleware/roleMiddleware');

// All routes require authentication
router.use(protect);

// Admin only
router.get('/', adminOnly, getAllUsers);
router.put('/:id', adminOnly, updateUser);
router.delete('/:id', adminOnly, deleteUser);
router.patch('/:id/activate', adminOnly, activateUser);
router.get('/list/managers', adminOnly, getManagers);

// Manager + Admin
router.get('/team/members', managerOrAdmin, getTeamMembers);
router.get('/:id', managerOrAdmin, getUserById);

module.exports = router;