const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
// const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// 🔒 All routes require authentication and admin role
// router.use(verifyToken);
// router.use(isAdmin);

// 📊 EXPENSE MANAGEMENT ROUTES

// Get all expenses with filters
router.get('/expenses', adminController.getAllExpenses);

// Get single expense by ID
router.get('/expenses/:expenseId', adminController.getExpenseById);
// const express = require('express');
// const router = express.Router();
// const approvalRuleController = require('../controllers/admin.controller');

// Get all users for dropdown
router.get('/users-dropdown', adminController.getUsers);

// Save approval rule
router.post('/approval-rule', adminController.createApprovalRule);
// module.exports = router;

// Get expense statistics
router.get('/expenses-statistics', adminController.getExpenseStatistics);

// Approve single expense
router.patch('/expenses/:expenseId/approve', adminController.approveExpense);

// Reject single expense
router.patch('/expenses/:expenseId/reject', adminController.rejectExpense);

// Override approval
router.patch('/expenses/:expenseId/override', adminController.overrideApproval);

// Bulk approve expenses
router.post('/expenses/bulk-approve', adminController.bulkApproveExpenses);

// 👥 USER MANAGEMENT ROUTES

// Get all users with filters (main user management)
router.get('/users', adminController.getAllUsers);

// Get users for dropdown (legacy/specific use case)
// router.get('/users-dropdown', adminController.getUsers);

// Create new user
router.post('/users', adminController.createUser);

// Update user
router.patch('/users/:userId', adminController.updateUser);

// Delete user
router.delete('/users/:userId', adminController.deleteUser);

// Toggle user status
router.patch('/users/:userId/toggle-status', adminController.toggleUserStatus);

// Reset user password
router.patch('/users/:userId/reset-password', adminController.resetUserPassword);

// Bulk import users
router.post('/users/bulk-import', adminController.bulkImportUsers);

// 📋 APPROVAL RULE ROUTES (legacy support)

// Save approval rule
// router.post('/approval-rule', adminController.createApprovalRule);

module.exports = router;
