const express = require('express');
const router = express.Router();
const {
  createIssue,
  getIssues,
  getIssueById,
  getMyReportedIssues,
  updateIssue,
  deleteIssue,
} = require('../controllers/issueController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .post(createIssue)
  .get(getIssues);

router.get('/user/my-reports', getMyReportedIssues);

router.route('/:id')
  .get(getIssueById)
  .put(updateIssue)
  .delete(deleteIssue);

module.exports = router;
