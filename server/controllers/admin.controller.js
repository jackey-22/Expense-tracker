const Expense = require('../models/expenses.model');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { generateRandomPassword } = require('../utils/passwordGenerator');
const ApprovalRule = require('../models/ApprovalRule.model');
// const User = require('../models/user.model');

// Fetch all active users for dropdown
exports.getUsers = async (req, res) => {
	try {
		const users = await User.find({ isActive: true }).select('_id name role');
		res.json({ success: true, data: users });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Failed to fetch users' });
	}
};

exports.createApprovalRule = async (req, res) => {
	try {
		const {
			description,
			manager,
			isManagerApprover,
			approvers,
			sequence,
			minApprovalPercent,
			company,
		} = req.body;

		if (!description || !manager || !approvers || approvers.length === 0) {
			return res.status(400).json({ success: false, message: 'Required fields missing' });
		}

		let approvalSteps = [];
		let ruleType = 'Percentage';

		// If manager is ticked as approver, push to first step
		if (isManagerApprover) {
			approvalSteps.push({ stepOrder: 1, approverUser: manager });
		}

		// Add other approvers
		approvers.forEach(() => {
			approvers.forEach((a) => {
				if (a.user) {
					const stepNumber = approvalSteps.length + 1;
					approvalSteps.push({ stepOrder: stepNumber, approverUser: a.user });
				}
			});
		});

		// Gather all "required" approvers
		const requiredApprovers = approvers.filter((a) => a.required && a.user).map((a) => a.user);

		// Determine rule type
		if (minApprovalPercent && requiredApprovers.length > 0) ruleType = 'Hybrid';
		else if (requiredApprovers.length > 0) ruleType = 'SpecificApprover';
		else ruleType = 'Percentage';

		const newRule = new ApprovalRule({
			company,
			name: description,
			approvalSteps,
			ruleType,
			isManagerApproverRequired: isManagerApprover,
			percentage: minApprovalPercent || null,
			specificApprover: requiredApprovers, // ✅ all ticked required users
		});

		await newRule.save();

		res.json({ success: true, message: 'Approval rule saved successfully' });
	} catch (error) {
		console.error('Error saving approval rule:', error);
		res.status(500).json({ success: false, message: 'Server error' });
	}
};

// � Get all expenses with filters
exports.getAllExpenses = async (req, res) => {
	try {
		const {
			employee,
			category,
			status,
			department,
			dateFrom,
			dateTo,
			search,
			page = 1,
			limit = 10,
		} = req.query;

		// Build filter query
		let filter = {};

		if (employee) {
			const user = await User.findOne({ name: employee });
			if (user) filter.userId = user._id;
		}

		if (category) filter.category = category;
		if (status) filter.status = status;
		if (department) {
			const users = await User.find({ department });
			const userIds = users.map((u) => u._id);
			filter.userId = { $in: userIds };
		}

		if (dateFrom || dateTo) {
			filter.date = {};
			if (dateFrom) filter.date.$gte = new Date(dateFrom);
			if (dateTo) filter.date.$lte = new Date(dateTo);
		}

		// Search across multiple fields
		if (search) {
			const users = await User.find({
				$or: [
					{ name: { $regex: search, $options: 'i' } },
					{ email: { $regex: search, $options: 'i' } },
				],
			});
			const userIds = users.map((u) => u._id);

			filter.$or = [
				{ userId: { $in: userIds } },
				{ description: { $regex: search, $options: 'i' } },
				{ category: { $regex: search, $options: 'i' } },
			];
		}

		// Pagination
		const skip = (page - 1) * limit;

		// Fetch expenses with user details
		const expenses = await Expense.find(filter)
			.populate('userId', 'name email department')
			.populate('approvedBy', 'name')
			.populate('rejectedBy', 'name')
			.sort({ submittedDate: -1 })
			.skip(skip)
			.limit(parseInt(limit));

		// Get total count for pagination
		const totalCount = await Expense.countDocuments(filter);

		// Calculate statistics
		const stats = await Expense.aggregate([
			{ $match: filter },
			{
				$group: {
					_id: '$status',
					count: { $sum: 1 },
					totalAmount: { $sum: '$amount' },
				},
			},
		]);

		const statistics = {
			total: totalCount,
			pending: stats.find((s) => s._id === 'Pending')?.count || 0,
			approved: stats.find((s) => s._id === 'Approved')?.count || 0,
			rejected: stats.find((s) => s._id === 'Rejected')?.count || 0,
			totalAmount: stats.reduce((sum, s) => sum + s.totalAmount, 0),
			pendingAmount: stats.find((s) => s._id === 'Pending')?.totalAmount || 0,
			approvedAmount: stats.find((s) => s._id === 'Approved')?.totalAmount || 0,
		};

		return res.status(200).json({
			success: true,
			expenses: expenses.map((exp) => ({
				id: exp._id,
				employee: exp.userId?.name || 'Unknown',
				employeeEmail: exp.userId?.email || '',
				department: exp.userId?.department || '',
				category: exp.category,
				amount: exp.amount,
				currency: exp.currency || 'USD',
				description: exp.description,
				date: exp.date,
				status: exp.status,
				manager: exp.manager || 'N/A',
				receipt: exp.receiptUrl || '',
				submittedDate: exp.submittedDate || exp.createdAt,
				approvedDate: exp.approvedDate,
				approvedBy: exp.approvedBy?.name,
				rejectedDate: exp.rejectedDate,
				rejectedBy: exp.rejectedBy?.name,
				rejectionReason: exp.rejectionReason,
				priority: exp.priority || 'Medium',
				notes: exp.notes || '',
			})),
			statistics,
			pagination: {
				currentPage: parseInt(page),
				totalPages: Math.ceil(totalCount / limit),
				totalRecords: totalCount,
				limit: parseInt(limit),
			},
		});
	} catch (error) {
		console.error('Error fetching expenses:', error);
		return res.status(500).json({
			success: false,
			message: 'Failed to fetch expenses',
			error: error.message,
		});
	}
};

// ✅ Approve single expense
exports.approveExpense = async (req, res) => {
	try {
		const { expenseId } = req.params;
		const adminId = req.user?._id; // From auth middleware

		const expense = await Expense.findById(expenseId);

		if (!expense) {
			return res.status(404).json({
				success: false,
				message: 'Expense not found',
			});
		}

		if (expense.status !== 'Pending') {
			return res.status(400).json({
				success: false,
				message: `Expense is already ${expense.status}`,
			});
		}

		expense.status = 'Approved';
		expense.approvedDate = new Date();
		if (adminId) expense.approvedBy = adminId;

		await expense.save();

		return res.status(200).json({
			success: true,
			message: 'Expense approved successfully',
			expense: {
				id: expense._id,
				status: expense.status,
				approvedDate: expense.approvedDate,
			},
		});
	} catch (error) {
		console.error('Error approving expense:', error);
		return res.status(500).json({
			success: false,
			message: 'Failed to approve expense',
			error: error.message,
		});
	}
};

// ❌ Reject single expense
exports.rejectExpense = async (req, res) => {
	try {
		const { expenseId } = req.params;
		const { rejectionReason } = req.body;
		const adminId = req.user?._id;

		if (!rejectionReason || rejectionReason.trim() === '') {
			return res.status(400).json({
				success: false,
				message: 'Rejection reason is required',
			});
		}

		const expense = await Expense.findById(expenseId);

		if (!expense) {
			return res.status(404).json({
				success: false,
				message: 'Expense not found',
			});
		}

		if (expense.status !== 'Pending') {
			return res.status(400).json({
				success: false,
				message: `Expense is already ${expense.status}`,
			});
		}

		expense.status = 'Rejected';
		expense.rejectedDate = new Date();
		if (adminId) expense.rejectedBy = adminId;
		expense.rejectionReason = rejectionReason;

		await expense.save();

		return res.status(200).json({
			success: true,
			message: 'Expense rejected successfully',
			expense: {
				id: expense._id,
				status: expense.status,
				rejectedDate: expense.rejectedDate,
				rejectionReason: expense.rejectionReason,
			},
		});
	} catch (error) {
		console.error('Error rejecting expense:', error);
		return res.status(500).json({
			success: false,
			message: 'Failed to reject expense',
			error: error.message,
		});
	}
};

// 🔄 Override approval (approve rejected expense)
exports.overrideApproval = async (req, res) => {
	try {
		const { expenseId } = req.params;
		const adminId = req.user?._id;

		const expense = await Expense.findById(expenseId);

		if (!expense) {
			return res.status(404).json({
				success: false,
				message: 'Expense not found',
			});
		}

		expense.status = 'Approved';
		expense.approvedDate = new Date();
		if (adminId) expense.approvedBy = adminId;
		expense.overridden = true;

		await expense.save();

		return res.status(200).json({
			success: true,
			message: 'Expense approval overridden successfully',
			expense: {
				id: expense._id,
				status: expense.status,
				approvedDate: expense.approvedDate,
				overridden: expense.overridden,
			},
		});
	} catch (error) {
		console.error('Error overriding approval:', error);
		return res.status(500).json({
			success: false,
			message: 'Failed to override approval',
			error: error.message,
		});
	}
};

// ✅ Bulk approve expenses
exports.bulkApproveExpenses = async (req, res) => {
	try {
		const { expenseIds } = req.body;
		const adminId = req.user?._id;

		if (!expenseIds || !Array.isArray(expenseIds) || expenseIds.length === 0) {
			return res.status(400).json({
				success: false,
				message: 'Expense IDs are required',
			});
		}

		const updateData = {
			status: 'Approved',
			approvedDate: new Date(),
		};
		if (adminId) updateData.approvedBy = adminId;

		const result = await Expense.updateMany(
			{
				_id: { $in: expenseIds },
				status: 'Pending',
			},
			{ $set: updateData }
		);

		return res.status(200).json({
			success: true,
			message: `${result.modifiedCount} expenses approved successfully`,
			approvedCount: result.modifiedCount,
		});
	} catch (error) {
		console.error('Error bulk approving expenses:', error);
		return res.status(500).json({
			success: false,
			message: 'Failed to bulk approve expenses',
			error: error.message,
		});
	}
};

// 📋 Get expense by ID
exports.getExpenseById = async (req, res) => {
	try {
		const { expenseId } = req.params;

		const expense = await Expense.findById(expenseId)
			.populate('userId', 'name email department')
			.populate('approvedBy', 'name')
			.populate('rejectedBy', 'name');

		if (!expense) {
			return res.status(404).json({
				success: false,
				message: 'Expense not found',
			});
		}

		return res.status(200).json({
			success: true,
			expense: {
				id: expense._id,
				employee: expense.userId?.name || 'Unknown',
				employeeEmail: expense.userId?.email || '',
				department: expense.userId?.department || '',
				category: expense.category,
				amount: expense.amount,
				currency: expense.currency || 'USD',
				description: expense.description,
				date: expense.date,
				status: expense.status,
				manager: expense.manager || 'N/A',
				receipt: expense.receiptUrl || '',
				submittedDate: expense.submittedDate || expense.createdAt,
				approvedDate: expense.approvedDate,
				approvedBy: expense.approvedBy?.name,
				rejectedDate: expense.rejectedDate,
				rejectedBy: expense.rejectedBy?.name,
				rejectionReason: expense.rejectionReason,
				priority: expense.priority || 'Medium',
				notes: expense.notes || '',
			},
		});
	} catch (error) {
		console.error('Error fetching expense:', error);
		return res.status(500).json({
			success: false,
			message: 'Failed to fetch expense',
			error: error.message,
		});
	}
};

// 📊 Get expense statistics
exports.getExpenseStatistics = async (req, res) => {
	try {
		const stats = await Expense.aggregate([
			{
				$group: {
					_id: '$status',
					count: { $sum: 1 },
					totalAmount: { $sum: '$amount' },
				},
			},
		]);

		const categoryStats = await Expense.aggregate([
			{
				$group: {
					_id: '$category',
					count: { $sum: 1 },
					totalAmount: { $sum: '$amount' },
				},
			},
		]);

		const totalExpenses = await Expense.countDocuments();

		return res.status(200).json({
			success: true,
			statistics: {
				total: totalExpenses,
				pending: stats.find((s) => s._id === 'Pending')?.count || 0,
				approved: stats.find((s) => s._id === 'Approved')?.count || 0,
				rejected: stats.find((s) => s._id === 'Rejected')?.count || 0,
				totalAmount: stats.reduce((sum, s) => sum + s.totalAmount, 0),
				pendingAmount: stats.find((s) => s._id === 'Pending')?.totalAmount || 0,
				approvedAmount: stats.find((s) => s._id === 'Approved')?.totalAmount || 0,
				byCategory: categoryStats,
			},
		});
	} catch (error) {
		console.error('Error fetching statistics:', error);
		return res.status(500).json({
			success: false,
			message: 'Failed to fetch statistics',
			error: error.message,
		});
	}
};

// 👥 Get users for dropdown (used by approval rules)
// exports.getUsers = async (req, res) => {
// 	try {
// 		const users = await User.find({ isActive: true })
// 			.select('name email role department')
// 			.sort({ name: 1 });

// 		return res.status(200).json({
// 			success: true,
// 			users: users.map((user) => ({
// 				id: user._id,
// 				name: user.name,
// 				email: user.email,
// 				role: user.role,
// 				department: user.department,
// 			})),
// 		});
// 	} catch (error) {
// 		console.error('Error fetching users:', error);
// 		return res.status(500).json({
// 			success: false,
// 			message: 'Failed to fetch users',
// 			error: error.message,
// 		});
// 	}
// };

// // 📋 Create approval rule
// exports.createApprovalRule = async (req, res) => {
// 	try {
// 		const { ruleName, conditions, approvers } = req.body;

// 		// Basic validation
// 		if (!ruleName || !conditions || !approvers) {
// 			return res.status(400).json({
// 				success: false,
// 				message: 'Rule name, conditions, and approvers are required',
// 			});
// 		}

// 		// For now, just return success as approval rules might need a separate model
// 		// This is a placeholder implementation
// 		return res.status(200).json({
// 			success: true,
// 			message: 'Approval rule created successfully',
// 			rule: {
// 				id: Date.now(), // Temporary ID
// 				ruleName,
// 				conditions,
// 				approvers,
// 				createdAt: new Date(),
// 			},
// 		});
// 	} catch (error) {
// 		console.error('Error creating approval rule:', error);
// 		return res.status(500).json({
// 			success: false,
// 			message: 'Failed to create approval rule',
// 			error: error.message,
// 		});
// 	}
// };

// �👥 USER MANAGEMENT FUNCTIONS

exports.getAllUsers = async (req, res) => {
	try {
		const { role, status, department, search, page = 1, limit = 50 } = req.query;

		// Build filter query
		let filter = {};

		if (role) filter.role = role;
		if (status) filter.status = status;
		if (department) filter.department = department;

		// Search across multiple fields
		if (search) {
			filter.$or = [
				{ name: { $regex: search, $options: 'i' } },
				{ email: { $regex: search, $options: 'i' } },
				{ department: { $regex: search, $options: 'i' } },
				{ jobTitle: { $regex: search, $options: 'i' } },
			];
		}

		// Pagination
		const skip = (page - 1) * limit;

		// Fetch users with manager details
		const users = await User.find(filter)
			.populate('manager', 'name email')
			.select('-password') // Exclude password field
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(parseInt(limit));

		// Get total count for pagination
		const totalCount = await User.countDocuments(filter);

		// Format response data
		const formattedUsers = users.map((user) => ({
			id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			department: user.department || '',
			manager: user.manager
				? {
						id: user.manager._id,
						name: user.manager.name,
						email: user.manager.email,
				  }
				: null,
			isManagerApprover: user.isManagerApprover || false,
			status: user.status || 'Active',
			phone: user.phone || '',
			location: user.location || '',
			jobTitle: user.jobTitle || '',
			lastLogin: user.lastLogin || null,
			createdAt: user.createdAt,
			isActive: user.isActive,
		}));

		return res.status(200).json({
			success: true,
			users: formattedUsers,
			pagination: {
				currentPage: parseInt(page),
				totalPages: Math.ceil(totalCount / limit),
				totalRecords: totalCount,
				limit: parseInt(limit),
			},
		});
	} catch (error) {
		console.error('Error fetching users:', error);
		return res.status(500).json({
			success: false,
			message: 'Failed to fetch users',
			error: error.message,
		});
	}
};

exports.createUser = async (req, res) => {
	try {
		const {
			name,
			email,
			password,
			role = 'Employee',
			department = '',
			manager = null,
			isManagerApprover = false,
			phone = '',
			location = '',
			jobTitle = '',
		} = req.body;

		// Validate required fields
		if (!name || !email || !password) {
			return res.status(400).json({
				success: false,
				message: 'Name, email, and password are required',
			});
		}

		// Check if email already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: 'Email already exists',
			});
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Validate manager if provided
		if (manager) {
			const managerUser = await User.findById(manager);
			if (!managerUser || managerUser.role !== 'Manager') {
				return res.status(400).json({
					success: false,
					message: 'Invalid manager selected',
				});
			}
		}

		// Create user
		const user = new User({
			name,
			email,
			password: hashedPassword,
			role,
			department,
			manager: manager || null,
			isManagerApprover,
			phone,
			location,
			jobTitle,
			status: 'Active',
			isActive: true,
		});

		await user.save();

		// Return user without password
		const createdUser = await User.findById(user._id)
			.populate('manager', 'name email')
			.select('-password');

		return res.status(201).json({
			success: true,
			message: 'User created successfully',
			user: {
				id: createdUser._id,
				name: createdUser.name,
				email: createdUser.email,
				role: createdUser.role,
				department: createdUser.department,
				manager: createdUser.manager
					? {
							id: createdUser.manager._id,
							name: createdUser.manager.name,
							email: createdUser.manager.email,
					  }
					: null,
				isManagerApprover: createdUser.isManagerApprover,
				status: createdUser.status,
				phone: createdUser.phone,
				location: createdUser.location,
				jobTitle: createdUser.jobTitle,
				createdAt: createdUser.createdAt,
				isActive: createdUser.isActive,
			},
		});
	} catch (error) {
		console.error('Error creating user:', error);
		return res.status(500).json({
			success: false,
			message: 'Failed to create user',
			error: error.message,
		});
	}
};

exports.updateUser = async (req, res) => {
	try {
		const { userId } = req.params;
		const {
			name,
			email,
			role,
			department,
			manager,
			isManagerApprover,
			phone,
			location,
			jobTitle,
		} = req.body;

		// Check if user exists
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'User not found',
			});
		}

		// Check if email already exists (excluding current user)
		if (email && email !== user.email) {
			const existingUser = await User.findOne({ email, _id: { $ne: userId } });
			if (existingUser) {
				return res.status(400).json({
					success: false,
					message: 'Email already exists',
				});
			}
		}

		// Validate manager if provided
		if (manager) {
			const managerUser = await User.findById(manager);
			if (!managerUser || managerUser.role !== 'Manager') {
				return res.status(400).json({
					success: false,
					message: 'Invalid manager selected',
				});
			}
		}

		// Update user fields
		const updateData = {};
		if (name) updateData.name = name;
		if (email) updateData.email = email;
		if (role) updateData.role = role;
		if (department !== undefined) updateData.department = department;
		if (manager !== undefined) updateData.manager = manager || null;
		if (isManagerApprover !== undefined) updateData.isManagerApprover = isManagerApprover;
		if (phone !== undefined) updateData.phone = phone;
		if (location !== undefined) updateData.location = location;
		if (jobTitle !== undefined) updateData.jobTitle = jobTitle;

		const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true })
			.populate('manager', 'name email')
			.select('-password');

		return res.status(200).json({
			success: true,
			message: 'User updated successfully',
			user: {
				id: updatedUser._id,
				name: updatedUser.name,
				email: updatedUser.email,
				role: updatedUser.role,
				department: updatedUser.department,
				manager: updatedUser.manager
					? {
							id: updatedUser.manager._id,
							name: updatedUser.manager.name,
							email: updatedUser.manager.email,
					  }
					: null,
				isManagerApprover: updatedUser.isManagerApprover,
				status: updatedUser.status,
				phone: updatedUser.phone,
				location: updatedUser.location,
				jobTitle: updatedUser.jobTitle,
				createdAt: updatedUser.createdAt,
				isActive: updatedUser.isActive,
			},
		});
	} catch (error) {
		console.error('Error updating user:', error);
		return res.status(500).json({
			success: false,
			message: 'Failed to update user',
			error: error.message,
		});
	}
};

exports.deleteUser = async (req, res) => {
	try {
		const { userId } = req.params;

		// Check if user exists
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'User not found',
			});
		}

		// Check if user has associated expenses
		const expenseCount = await Expense.countDocuments({ userId });
		if (expenseCount > 0) {
			return res.status(400).json({
				success: false,
				message: 'Cannot delete user with associated expenses',
			});
		}

		// Delete user
		await User.findByIdAndDelete(userId);

		return res.status(200).json({
			success: true,
			message: 'User deleted successfully',
		});
	} catch (error) {
		console.error('Error deleting user:', error);
		return res.status(500).json({
			success: false,
			message: 'Failed to delete user',
			error: error.message,
		});
	}
};

exports.toggleUserStatus = async (req, res) => {
	try {
		const { userId } = req.params;

		// Check if user exists
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'User not found',
			});
		}

		// Toggle status and isActive
		const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
		const newIsActive = newStatus === 'Active';

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{
				status: newStatus,
				isActive: newIsActive,
			},
			{ new: true }
		)
			.populate('manager', 'name email')
			.select('-password');

		return res.status(200).json({
			success: true,
			message: `User ${newStatus.toLowerCase()} successfully`,
			user: {
				id: updatedUser._id,
				name: updatedUser.name,
				email: updatedUser.email,
				role: updatedUser.role,
				department: updatedUser.department,
				manager: updatedUser.manager
					? {
							id: updatedUser.manager._id,
							name: updatedUser.manager.name,
							email: updatedUser.manager.email,
					  }
					: null,
				isManagerApprover: updatedUser.isManagerApprover,
				status: updatedUser.status,
				phone: updatedUser.phone,
				location: updatedUser.location,
				jobTitle: updatedUser.jobTitle,
				createdAt: updatedUser.createdAt,
				isActive: updatedUser.isActive,
			},
		});
	} catch (error) {
		console.error('Error toggling user status:', error);
		return res.status(500).json({
			success: false,
			message: 'Failed to toggle user status',
			error: error.message,
		});
	}
};

exports.resetUserPassword = async (req, res) => {
	try {
		const { userId } = req.params;

		// Check if user exists
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'User not found',
			});
		}

		// Generate temporary password
		const tempPassword = generateRandomPassword();
		const hashedPassword = await bcrypt.hash(tempPassword, 10);

		// Update user password
		await User.findByIdAndUpdate(userId, { password: hashedPassword });

		// TODO: Send email with new password

		return res.status(200).json({
			success: true,
			message: 'Password reset successfully',
			tempPassword, // In production, this should be sent via email only
		});
	} catch (error) {
		console.error('Error resetting password:', error);
		return res.status(500).json({
			success: false,
			message: 'Failed to reset password',
			error: error.message,
		});
	}
};

exports.bulkImportUsers = async (req, res) => {
	try {
		const { users } = req.body;

		if (!users || !Array.isArray(users) || users.length === 0) {
			return res.status(400).json({
				success: false,
				message: 'Users array is required',
			});
		}

		const results = {
			successful: 0,
			failed: 0,
			errors: [],
		};

		// Process each user
		for (let i = 0; i < users.length; i++) {
			try {
				const userData = users[i];

				// Validate required fields
				if (!userData.name || !userData.email) {
					results.failed++;
					results.errors.push(`Row ${i + 1}: Name and email are required`);
					continue;
				}

				// Check if email already exists
				const existingUser = await User.findOne({ email: userData.email });
				if (existingUser) {
					results.failed++;
					results.errors.push(`Row ${i + 1}: Email ${userData.email} already exists`);
					continue;
				}

				// Generate password if not provided
				const password = userData.password || generateRandomPassword();
				const hashedPassword = await bcrypt.hash(password, 10);

				// Create user
				const user = new User({
					name: userData.name,
					email: userData.email,
					password: hashedPassword,
					role: userData.role || 'Employee',
					department: userData.department || '',
					phone: userData.phone || '',
					location: userData.location || '',
					jobTitle: userData.jobTitle || '',
					status: 'Active',
					isActive: true,
				});

				await user.save();
				results.successful++;
			} catch (error) {
				results.failed++;
				results.errors.push(`Row ${i + 1}: ${error.message}`);
			}
		}

		return res.status(200).json({
			success: true,
			message: `Bulk import completed. ${results.successful} successful, ${results.failed} failed`,
			results,
		});
	} catch (error) {
		console.error('Error bulk importing users:', error);
		return res.status(500).json({
			success: false,
			message: 'Failed to bulk import users',
			error: error.message,
		});
	}
};
