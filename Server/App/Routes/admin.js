const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth.js');
const adminOnly = require('../Middleware/admin.js');
const {
  getAllIssuesWithUser,
  updateIssue,
  deleteIssue
} = require('../Controller/IssueController.js');

router.get('/', auth, adminOnly, getAllIssuesWithUser); // List all issues with user info
router.patch('/:id', auth, adminOnly, updateIssue);     // Update issue (status, comments)
router.delete('/:id', auth, adminOnly, deleteIssue);    // Delete issue

module.exports = router;
