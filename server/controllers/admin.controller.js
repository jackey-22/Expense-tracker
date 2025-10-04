const ApprovalRule = require('../models/ApprovalRule.model');
const User = require('../models/user.model');

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
