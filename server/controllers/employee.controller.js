// controllers/expenseController.js
const Expense = require('../models/expenses.model');
const ApprovalRule = require('../models/ApprovalRule.model');
const User = require('../models/user.model');
// controllers/expenseController.js - Temporary fix
async function createExpense(req, res) {
	try {
		// Temporary: Use default user if no auth
		let authUser = req.user || res.locals.user;

		if (!authUser) {
			// Use a default user for testing
			authUser = {
				userId: '670ffdcf7c5a1e8b12345678', // Use an existing user ID from your DB
				company: '670ffdcf7c5a1e8b87654321', // Use an existing company ID from your DB
			};
			console.log('Using default user for testing:', authUser);
		}

		const {
			amount,
			currency,
			category,
			description,
			date,
			paidBy,
			submitForApproval = true,
		} = req.body;

		// Validate required fields
		if (!amount || !description) {
			return res.status(400).json({
				success: false,
				message: 'Amount and description are required fields',
			});
		}

		// Create expense
		const expense = new Expense({
			company: authUser.company,
			employee: authUser.userId,
			amount,
			currency: currency || 'USD',
			category,
			description,
			date: date || new Date(),
			paidBy: paidBy || authUser.userId,
			approvalStatus: submitForApproval ? 'InProgress' : 'Draft',
		});

		// If submitting for approval, determine approver
		if (submitForApproval) {
			const rules = await ApprovalRule.findOne({
				company: authUser.company,
				isActive: true,
			});

			let nextApprover = null;
			if (rules && rules.approvalSteps.length > 0) {
				const firstStep = rules.approvalSteps[0];
				if (firstStep.approverRole === 'Manager') {
					const employee = await User.findById(authUser.userId);
					nextApprover = employee?.manager || null;
				} else if (firstStep.approverUser) {
					nextApprover = firstStep.approverUser;
				}
			}
			expense.currentApprover = nextApprover;
		}

		await expense.save();

		const populatedExpense = await Expense.findById(expense._id)
			.populate('employee', 'name email')
			.populate('paidBy', 'name')
			.populate('company', 'name')
			.populate('currentApprover', 'name');

		res.status(201).json({
			success: true,
			message: submitForApproval
				? 'Expense created and submitted for approval'
				: 'Expense saved as draft successfully',
			expense: populatedExpense,
		});
	} catch (error) {
		console.error('Error creating expense:', error);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}
// In controllers/expenseController.js - Update getExpenses function
async function getExpenses(req, res) {
	try {
		const { status, startDate, endDate, category, page = 1, limit = 10 } = req.query;

		// Temporary: Use default user if no auth
		let authUser = req.user || res.locals.user;

		if (!authUser) {
			// For testing, use a default user ID from your database
			// Replace this with an actual user ID from your users collection
			authUser = {
				userId: '670ffdcf7c5a1e8b12345678', // Use an existing user ID from your DB
			};
			console.log('Using default user for expenses fetch:', authUser);
		}

		let query = { employee: authUser.userId };

		// Handle status filter - include 'Draft' status
		if (status && status !== 'all') {
			if (status === 'draft') {
				query.approvalStatus = 'Draft';
			} else if (status === 'submitted') {
				query.approvalStatus = 'InProgress';
			} else {
				query.approvalStatus = status;
			}
		}

		if (category && category !== 'all') query.category = category;
		if (startDate && endDate) {
			query.date = {
				$gte: new Date(startDate),
				$lte: new Date(endDate),
			};
		}

		const expenses = await Expense.find(query)
			.populate('employee', 'name email')
			.populate('paidBy', 'name')
			.populate('company', 'name')
			.populate('currentApprover', 'name')
			.sort({ createdAt: -1 })
			.limit(limit * 1)
			.skip((page - 1) * limit);

		const total = await Expense.countDocuments(query);

		res.json({
			success: true,
			expenses,
			total,
			currentPage: page,
			totalPages: Math.ceil(total / limit),
		});
	} catch (error) {
		console.error('Error fetching expenses:', error);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}

async function approveExpense(req, res) {
	try {
		const { id } = req.params;
		const { action, remarks } = req.body;

		const expense = await Expense.findById(id);
		if (!expense) {
			return res.status(404).json({
				success: false,
				message: 'Expense not found',
			});
		}

		// Check if user is the current approver
		if (expense.currentApprover && expense.currentApprover.toString() !== req.user.userId) {
			return res.status(403).json({
				success: false,
				message: 'Not authorized to approve this expense',
			});
		}

		if (action === 'approve') {
			const rules = await ApprovalRule.findOne({
				company: expense.company,
				isActive: true,
			});

			if (rules && rules.approvalSteps.length > 0) {
				const currentStepIndex = rules.approvalSteps.findIndex(
					(step) =>
						step.approverRole === 'Manager' ||
						step.approverUser?.toString() === req.user.userId
				);

				if (currentStepIndex < rules.approvalSteps.length - 1) {
					const nextStep = rules.approvalSteps[currentStepIndex + 1];
					expense.currentApprover = nextStep.approverUser;
					expense.approvalStatus = 'InProgress';
				} else {
					expense.approvalStatus = 'Approved';
					expense.currentApprover = null;
				}
			} else {
				expense.approvalStatus = 'Approved';
				expense.currentApprover = null;
			}
		} else if (action === 'reject') {
			expense.approvalStatus = 'Rejected';
			expense.currentApprover = null;
		}

		expense.remarks = remarks;
		await expense.save();

		const updatedExpense = await Expense.findById(id)
			.populate('employee', 'name email')
			.populate('paidBy', 'name')
			.populate('company', 'name')
			.populate('currentApprover', 'name');

		res.json({
			success: true,
			message: `Expense ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
			expense: updatedExpense,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}

async function getExpenseById(req, res) {
	try {
		const { id } = req.params;

		const expense = await Expense.findById(id)
			.populate('employee', 'name email')
			.populate('paidBy', 'name')
			.populate('company', 'name')
			.populate('currentApprover', 'name');

		if (!expense) {
			return res.status(404).json({
				success: false,
				message: 'Expense not found',
			});
		}

		// Check authorization
		if (
			expense.employee._id.toString() !== req.user.userId &&
			(!expense.currentApprover || expense.currentApprover._id.toString() !== req.user.userId)
		) {
			return res.status(403).json({
				success: false,
				message: 'Not authorized to view this expense',
			});
		}

		res.json({
			success: true,
			expense,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}

async function getPendingApprovals(req, res) {
	try {
		const expenses = await Expense.find({
			currentApprover: req.user.userId,
			approvalStatus: 'InProgress',
		})
			.populate('employee', 'name email')
			.populate('paidBy', 'name')
			.populate('company', 'name')
			.sort({ createdAt: -1 });

		res.json({
			success: true,
			expenses,
			total: expenses.length,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}

// Helper function
function getActionMessage(action) {
	const messages = {
		submit: 'Expense submitted for approval',
		update: 'Expense updated successfully',
		draft: 'Expense saved as draft',
	};
	return messages[action] || 'Action completed successfully';
}

async function fetchAllUsers(req, res) {
	try {
		// Fetch only active users and return plain JS objects
		const users = await User.find({ isActive: true }).select('name email role _id').lean();

		res.json({
			success: true,
			users,
			count: users.length,
		});
	} catch (err) {
		console.error('Error fetching users:', err);

		res.status(500).json({
			success: false,
			message: 'Failed to fetch users',
			error: err.message,
		});
	}
}

module.exports = {
	createExpense,
	getExpenses,
	approveExpense,
	getExpenseById,
	getPendingApprovals,
	fetchAllUsers,
};
