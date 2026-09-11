const express = require('express');
const router = express.Router();
const {
  createHelpRequest,
  getHelpRequests,
  getHelpRequestById,
  updateHelpRequest,
  deleteHelpRequest,
  getMyHelpRequests,
} = require('../controllers/helpController');
const { getMatchesForRequest } = require('../controllers/matchingController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .post(createHelpRequest)
  .get(getHelpRequests);

router.get('/user/my-requests', getMyHelpRequests);

router.route('/:id')
  .get(getHelpRequestById)
  .put(updateHelpRequest)
  .delete(deleteHelpRequest);

// Smart Matching Engine endpoint
router.get('/:id/matches', getMatchesForRequest);

module.exports = router;
