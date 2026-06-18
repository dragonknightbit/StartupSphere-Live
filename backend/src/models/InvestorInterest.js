const mongoose = require('mongoose');

const investorInterestSchema = new mongoose.Schema({
  investorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
  message: { type: String },
  investmentAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['interested', 'passed', 'invested'], default: 'interested' }
}, { timestamps: true });

module.exports = mongoose.model('InvestorInterest', investorInterestSchema);
