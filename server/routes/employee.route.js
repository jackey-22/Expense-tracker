const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/employee.controller');
const { asyncRouteHandler } = require('../utils/route.utils');
const { upload } = require('../utils/multer.utils');
// const { authMiddleware } = require('../middleware/auth.middleware');

// POST routes
router.post('/create-expense', asyncRouteHandler(expenseController.createExpense)); // Create expense (with optional auto-submit)
// router.post('/:id/update', expenseController.updateExpense); // Update expense or submit for approval
router.post('/:id/approve', asyncRouteHandler(expenseController.approveExpense)); // Approve/Reject expense

// GET routes
// GET routes
router.get('/expenses', asyncRouteHandler(expenseController.getExpenses)); // Get all expenses
router.get('/pending-approval', asyncRouteHandler(expenseController.getPendingApprovals)); // Get pending approvals
router.get('/all-users', asyncRouteHandler(expenseController.fetchAllUsers)); // <-- move this above /:id
router.get('/:id', asyncRouteHandler(expenseController.getExpenseById)); // Get single expense by ID

module.exports = router;
