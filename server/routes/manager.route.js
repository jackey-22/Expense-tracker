const express = require('express');
const router = express.Router();
// const authenticate = require('../middleware/auth');
const { asyncRouteHandler } = require('../utils/route.utils');
const {
	getPendingApprovals,
	getAllExpenses,
	approveExpense,
	getApprovalStats,
	getExpenseDetails,
} = require('../controllers/manager.controller');

// Get pending approvals for the current manager
router.get('/pending-approvals', asyncRouteHandler(getPendingApprovals));

// Get all expenses with filtering (manager view)
router.get('/expenses', asyncRouteHandler(getAllExpenses));

// Approve or reject an expense
router.post('/approve-expense/:id', asyncRouteHandler(approveExpense));

// Get approval statistics for dashboard
router.get('/approval-stats', asyncRouteHandler(getApprovalStats));

// Get detailed expense information
router.get('/expense-details/:id', asyncRouteHandler(getExpenseDetails));

module.exports = router;
