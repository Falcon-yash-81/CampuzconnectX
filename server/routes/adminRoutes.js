const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAdminUsers,
  updateUserRole,
  updateAdminIssue,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAdminUsers);
router.put('/users/:id', updateUserRole);
router.put('/issues/:id', updateAdminIssue);

module.exports = router;
