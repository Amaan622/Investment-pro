const mongoose = require("mongoose");

const roiHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    investment: { type: mongoose.Schema.Types.ObjectId, ref: "Investment", required: true },
    date: { type: Date, required: true }, // the date for which ROI was credited (normalized to midnight UTC)
    amount: { type: Number, required: true }, // ROI amount credited
    roiPercent: { type: Number, required: true }, // percent applied
    type: {
      type: String,
      enum: ["DAILY_ROI", "LEVEL_INCOME"],
      default: "DAILY_ROI",
    },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

// Compound index to enforce idempotency — one ROI entry per investment per date
roiHistorySchema.index({ investment: 1, date: 1, type: 1 }, { unique: true });
roiHistorySchema.index({ user: 1, date: 1 });

module.exports = mongoose.model("ROIHistory", roiHistorySchema);
