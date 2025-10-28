const express = require("express");
const router = express.Router();
const auth = require("../Middleware/auth.js");
const adminOnly = require("../Middleware/admin.js");
const { getIssues, updateIssue, deleteIssue } = require("../Controller/IssueController.js");

// ✅ Admin can view, update, and delete issues
router.get("/", auth, adminOnly, getIssues);
router.patch("/:id", auth, adminOnly, updateIssue);
router.delete("/:id", auth, adminOnly, deleteIssue);

module.exports = router;
