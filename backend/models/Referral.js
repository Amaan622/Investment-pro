const mongoose = require("mongoose");

// Commission percentages for each referral level
const LEVEL_COMMISSIONS = {
  1: 5,   // direct referral → 5%
  2: 3,   // level 2 → 3%
  3: 2,   // level 3 → 2%
  4: 1,   // level 4 → 1%
  5: 0.5, // level 5 → 0.5%
};

const referralSchema = new mongoose.Schema(
  {
    // Who earned the commission
    beneficiary: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    // The user whose investment triggered this commission
    sourceUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // The investment that generated the ROI
    sourceInvestment: { type: mongoose.Schema.Types.ObjectId, ref: "Investment", required: true },
    // The ROI history entry that triggered this level income
    sourceROI: { type: mongoose.Schema.Types.ObjectId, ref: "ROIHistory", required: true },

    level: { type: Number, required: true, min: 1, max: 5 },
    commissionPercent: { type: Number, required: true },
    roiAmount: { type: Number, required: true },      // original ROI amount
    levelIncomeAmount: { type: Number, required: true }, // derived commission
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

// Idempotency: one level income per ROI entry per beneficiary
referralSchema.index({ sourceROI: 1, beneficiary: 1 }, { unique: true });
referralSchema.index({ beneficiary: 1, date: -1 });

referralSchema.statics.LEVEL_COMMISSIONS = LEVEL_COMMISSIONS;

module.exports = mongoose.model("Referral", referralSchema);
