const approvalFlowSchema = new mongoose.Schema({
  expense: { type: mongoose.Schema.Types.ObjectId, ref: 'Expense', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  steps: [
    {
      stepOrder: Number,
      approver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      role: { type: String },
      required: { type: Boolean, default: false }, // if marked, this approver must approve
      decision: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
      decidedAt: Date,
      remarks: String,
    },
  ],
  overallStatus: { type: String, enum: ['InProgress', 'Approved', 'Rejected'], default: 'InProgress' },
});
