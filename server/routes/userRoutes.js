const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateProfile,
  updateSkills,
  getSkillExchanges,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getAllUsers);
router.get('/skill-exchanges', getSkillExchanges);
router.get('/:id', getUserById);
router.put('/profile', updateProfile);
router.put('/skills', updateSkills);

module.exports = router;
