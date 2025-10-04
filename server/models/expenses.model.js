// models/Expense.js
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
	{
		company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
		employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		amount: { type: Number, required: true },
		currency: { type: String, required: true }, // can differ from company currency
		convertedAmount: { type: Number }, // stored after currency conversion
		category: {
			type: String,
		},
		description: { type: String },
		date: { type: Date, required: true },
		paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		receipt: { type: mongoose.Schema.Types.ObjectId, ref: 'Receipt' },
		approvalStatus: {
			type: String,
			enum: ['Draft', 'InProgress', 'Approved', 'Rejected'],
			default: 'Draft',
		},
		currentApprover: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		remarks: { type: String },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
