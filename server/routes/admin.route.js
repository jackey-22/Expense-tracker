const express = require('express');
const router = express.Router();
const approvalRuleController = require('../controllers/admin.controller');

// Get all users for dropdown
router.get('/users', approvalRuleController.getUsers);

// Save approval rule
router.post('/approval-rule', approvalRuleController.createApprovalRule);

module.exports = router;
