// controllers/manager.controller.js
const Expense = require('../models/expenses.model');
const ApprovalRule = require('../models/ApprovalRule.model');
const User = require('../models/user.model');

// Temporary authentication bypass
const getAuthUser = (req) => {
	// Try to get user from session or use default
	let authUser = req.user || req.session?.user;

	// If no auth user found, use Conrad as the default manager for testing
	if (!authUser) {
		console.log('⚠️ No authenticated user found, using Conrad as manager');
		authUser = {
			userId: '68e0cdef6d0939ebe34245c8', // Conrad's user ID
			company: '68e0a912ec22cf9878c4cec1', // Company ID
			name: 'Conrad',
			email: 'conrad@gmail.com',
			role: 'Manager',
		};
	}

	console.log('👤 Using auth user:', authUser);
	return authUser;
};

// Get ALL pending approvals for the company (not just assigned to current user)
async function getPendingApprovals(req, res) {
	try {
		const authUser = getAuthUser(req);

		console.log('🔍 Fetching ALL pending approvals for company:', authUser.company);

		// Find ALL pending expenses for the company (not just assigned to current user)
		const expenses = await Expense.find({
			// company: authUser.company,
			approvalStatus: 'InProgress',
		})
			.populate('employee', 'name email')
			.populate('paidBy', 'name')
			.populate('company', 'name')
			.populate('currentApprover', 'name')
			.sort({ createdAt: -1 });

		console.log(`📋 Found ${expenses.length} pending approvals for company`);

		res.json({
			success: true,
			expenses,
			total: expenses.length,
		});
	} catch (error) {
		console.error('❌ Error in getPendingApprovals:', error);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}

// Get all expenses for manager view (with filtering)
async function getAllExpenses(req, res) {
	try {
		const { status, category, page = 1, limit = 50 } = req.query;

		// Fetch all expenses without filtering by company
		let query = {};

		// Filter by status
		if (status && status !== 'all') {
			query.approvalStatus = status;
		}

		// Filter by category
		if (category && category !== 'all') {
			query.category = category;
		}

		console.log('🔍 Fetching all expenses with query:', query);

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
			currentPage: parseInt(page),
			totalPages: Math.ceil(total / limit),
		});
	} catch (error) {
		console.error('❌ Error in getAllExpenses:', error);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}

// Approve or reject an expense
async function approveExpense(req, res) {
	try {
		const { id } = req.params;
		const { action, remarks } = req.body;
		const authUser = getAuthUser(req);

		console.log(`🔄 Processing ${action} for expense ${id} by user ${authUser.userId}`);

		const expense = await Expense.findById(id);
		if (!expense) {
			return res.status(404).json({
				success: false,
				message: 'Expense not found',
			});
		}

		// For testing, bypass the approver check temporarily
		// if (!expense.currentApprover || expense.currentApprover.toString() !== authUser.userId) {
		//     return res.status(403).json({
		//         success: false,
		//         message: 'Not authorized to approve this expense',
		//     });
		// }

		// Check if expense is in pending status
		if (expense.approvalStatus !== 'InProgress') {
			return res.status(400).json({
				success: false,
				message: 'Expense is not in pending status',
			});
		}

		let updatedExpense;

		if (action === 'approve') {
			// Get active approval rule
			const rules = await ApprovalRule.findOne({
				company: expense.company,
				isActive: true,
			});

			if (rules && rules.approvalSteps.length > 0) {
				// Find current step index
				const currentStepIndex = rules.approvalSteps.findIndex(
					(step) => step.approverUser?.toString() === authUser.userId
				);

				console.log(
					`📊 Current step index: ${currentStepIndex}, Total steps: ${rules.approvalSteps.length}`
				);

				if (currentStepIndex < rules.approvalSteps.length - 1) {
					// Move to next step
					const nextStep = rules.approvalSteps[currentStepIndex + 1];
					expense.currentApprover = nextStep.approverUser;
					expense.approvalStatus = 'InProgress';

					console.log(`➡️ Moving to next step. New approver: ${nextStep.approverUser}`);
				} else {
					// Final approval
					expense.approvalStatus = 'Approved';
					expense.currentApprover = null;
					console.log('✅ Final approval granted');
				}
			} else {
				// No approval rules, single step approval
				expense.approvalStatus = 'Approved';
				expense.currentApprover = null;
				console.log('✅ Single step approval (no rules)');
			}
		} else if (action === 'reject') {
			expense.approvalStatus = 'Rejected';
			expense.currentApprover = null;
			console.log('❌ Expense rejected');
		}

		// Add to history
		if (!expense.history) {
			expense.history = [];
		}

		expense.history.push({
			approver: authUser.userId,
			action: action === 'approve' ? 'Approved' : 'Rejected',
			remarks: remarks,
			decidedAt: new Date(),
		});

		expense.remarks = remarks;
		await expense.save();

		// Populate and return updated expense
		updatedExpense = await Expense.findById(id)
			.populate('employee', 'name email')
			.populate('paidBy', 'name')
			.populate('company', 'name')
			.populate('currentApprover', 'name');

		console.log(`✅ Expense ${id} ${action}d successfully`);

		res.json({
			success: true,
			message: `Expense ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
			expense: updatedExpense,
		});
	} catch (error) {
		console.error('❌ Error in approveExpense:', error);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}

// Get approval statistics for dashboard
async function getApprovalStats(req, res) {
	try {
		const authUser = getAuthUser(req);

		const pendingCount = await Expense.countDocuments({
			currentApprover: authUser.userId,
			approvalStatus: 'InProgress',
		});

		const totalApproved = await Expense.countDocuments({
			company: authUser.company,
			approvalStatus: 'Approved',
		});

		const totalRejected = await Expense.countDocuments({
			company: authUser.company,
			approvalStatus: 'Rejected',
		});

		const totalPending = await Expense.countDocuments({
			company: authUser.company,
			approvalStatus: 'InProgress',
		});

		res.json({
			success: true,
			stats: {
				pendingApprovals: pendingCount,
				totalApproved,
				totalRejected,
				totalPending,
				totalProcessed: totalApproved + totalRejected,
			},
		});
	} catch (error) {
		console.error('❌ Error in getApprovalStats:', error);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}

// Get expense details for review
async function getExpenseDetails(req, res) {
	try {
		const { id } = req.params;
		const authUser = getAuthUser(req);

		const expense = await Expense.findById(id)
			.populate('employee', 'name email department')
			.populate('paidBy', 'name email')
			.populate('company', 'name')
			.populate('currentApprover', 'name email')
			.populate('history.approver', 'name email');

		if (!expense) {
			return res.status(404).json({
				success: false,
				message: 'Expense not found',
			});
		}

		// For testing, bypass permission check temporarily
		// const canView = expense.currentApprover?.toString() === authUser.userId ||
		//                expense.employee._id.toString() === authUser.userId;

		// if (!canView) {
		//     return res.status(403).json({
		//         success: false,
		//         message: 'Not authorized to view this expense',
		//     });
		// }

		res.json({
			success: true,
			expense,
		});
	} catch (error) {
		console.error('❌ Error in getExpenseDetails:', error);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}

module.exports = {
	getPendingApprovals,
	getAllExpenses,
	approveExpense,
	getApprovalStats,
	getExpenseDetails,
};
