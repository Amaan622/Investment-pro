const mongoose = require("mongoose");

const PLANS = {
  STARTER: { name: "Starter", minAmount: 100, maxAmount: 999, dailyROIPercent: 0.5, durationDays: 30 },
  GROWTH:  { name: "Growth",  minAmount: 1000, maxAmount: 4999, dailyROIPercent: 0.75, durationDays: 60 },
  PRO:     { name: "Pro",     minAmount: 5000, maxAmount: 19999, dailyROIPercent: 1.0, durationDays: 90 },
  ELITE:   { name: "Elite",   minAmount: 20000, maxAmount: Infinity, dailyROIPercent: 1.25, durationDays: 180 },
};

const investmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true, min: 100 },
    plan: {
      type: String,
      enum: Object.keys(PLANS),
      required: true,
    },
    dailyROIPercent: { type: Number, required: true }, // snapshot at investment time
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "CANCELLED"],
      default: "ACTIVE",
    },
    totalROIPaid: { type: Number, default: 0 },
    lastROIDate: { type: Date, default: null }, // last date ROI was credited
  },
  { timestamps: true }
);

investmentSchema.virtual("expectedTotalROI").get(function () {
  const plan = PLANS[this.plan];
  return (this.amount * this.dailyROIPercent * plan.durationDays) / 100;
});

investmentSchema.statics.PLANS = PLANS;

investmentSchema.statics.getPlanForAmount = function (amount) {
  return Object.entries(PLANS).find(
    ([, p]) => amount >= p.minAmount && amount <= p.maxAmount
  );
};

module.exports = mongoose.model("Investment", investmentSchema);
