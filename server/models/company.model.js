// models/Company.js
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		country: { type: String, required: true },
		defaultCurrency: {
			type: String,
			required: true,
		},
		admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        isActive: { type: Boolean, default: true }, 
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
