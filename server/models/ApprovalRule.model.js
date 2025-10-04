const mongoose = require('mongoose');
const approvalRuleSchema = new mongoose.Schema(
	{
		company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
		name: { type: String, required: true },
		approvalSteps: [
			{
				stepOrder: Number,
				// approverRole: { type: String, enum: ['Manager', 'Finance', 'Director'] },
				approverUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
			},
		],
		ruleType: {
			type: String,
			enum: ['Percentage', 'SpecificApprover', 'Hybrid'],
			default: 'Percentage',
		},
		isManagerApproverRequired: { type: Boolean, default: false }, // duplicate of user flag, but rule-based
		percentage: Number, // e.g. 60
		specificApprover: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		isActive: { type: Boolean, default: true }, // Soft delete flag
	},
	{ timestamps: true }
);

module.exports = mongoose.model('ApprovalRule', approvalRuleSchema);
