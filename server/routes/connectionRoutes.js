const express = require('express');
const router = express.Router();
const {
  createConnection,
  getConnections,
  updateConnectionStatus,
  completeConnection,
} = require('../controllers/connectionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .post(createConnection)
  .get(getConnections);

router.route('/:id')
  .put(updateConnectionStatus);

router.post('/:id/complete', completeConnection);

module.exports = router;
