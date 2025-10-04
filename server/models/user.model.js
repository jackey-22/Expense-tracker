// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, unique: true, required: true },
		password: { type: String, required: true },
		role: {
			type: String,
			enum: ['Admin', 'Manager', 'Employee'],
			default: 'Employee',
		},
		company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
		manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		isManagerApprover: { type: Boolean, default: false }, // The expense is first approved by his manager if this field is checked.
		department: { type: String, default: '' },
		phone: { type: String, default: '' },
		location: { type: String, default: '' },
		jobTitle: { type: String, default: '' },
		isActive: { type: Boolean, default: true }, // Soft delete flag
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
