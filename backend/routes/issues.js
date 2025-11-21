const express = require('express');
const {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  addComment,
  getUserIssues,
  getDashboardStats
} = require('../controllers/issueController');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

router.post('/', createIssue);
router.get('/', getAllIssues);
router.get('/my-issues', getUserIssues);
router.get('/stats', getDashboardStats);
router.get('/:id', getIssueById);
router.put('/:id', updateIssue);
router.post('/:id/comments', addComment);

module.exports = router;