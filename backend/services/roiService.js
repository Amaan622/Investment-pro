const Investment = require("../models/Investment");
const ROIHistory = require("../models/ROIHistory");
const Referral = require("../models/Referral");
const User = require("../models/User");

/**
 * Normalize a date to midnight UTC (strips time component).
 * Used for idempotency — same date = same key.
 */
function toMidnightUTC(date = new Date()) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/**
 * Calculate and credit daily ROI for a single investment.
 * Idempotent: skips if ROI already credited for this date.
 * Returns { credited: boolean, amount: number }
 */
async function creditDailyROI(investment, forDate = new Date()) {
  const date = toMidnightUTC(forDate);

  // Guard: investment must be active and within date range
  if (investment.status !== "ACTIVE") return { credited: false, reason: "NOT_ACTIVE" };
  if (new Date(investment.endDate) < date) {
    await Investment.findByIdAndUpdate(investment._id, { status: "COMPLETED" });
    return { credited: false, reason: "EXPIRED" };
  }

  const roiAmount = parseFloat(
    ((investment.amount * investment.dailyROIPercent) / 100).toFixed(4)
  );

  try {
    // Unique index on (investment, date, type) enforces idempotency
    const roiEntry = await ROIHistory.create({
      user: investment.user,
      investment: investment._id,
      date,
      amount: roiAmount,
      roiPercent: investment.dailyROIPercent,
      type: "DAILY_ROI",
    });

    // Update investment and user balances
    await Investment.findByIdAndUpdate(investment._id, {
      $inc: { totalROIPaid: roiAmount },
      lastROIDate: date,
    });

    await User.findByIdAndUpdate(investment.user, {
      $inc: { walletBalance: roiAmount, totalROIEarned: roiAmount },
    });

    // Propagate level income to upline
    await creditLevelIncome(investment, roiEntry, roiAmount);

    return { credited: true, amount: roiAmount, roiEntryId: roiEntry._id };
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key — already processed for this date
      return { credited: false, reason: "ALREADY_PROCESSED" };
    }
    throw err;
  }
}

/**
 * Walk up the referral chain (up to 5 levels) and credit level income.
 */
async function creditLevelIncome(investment, roiEntry, roiAmount) {
  const COMMISSIONS = Referral.LEVEL_COMMISSIONS;
  const MAX_LEVELS = Object.keys(COMMISSIONS).length;

  // Load the investor to start walking up
  let currentUser = await User.findById(investment.user).select("referredBy");
  const credited = [];

  for (let level = 1; level <= MAX_LEVELS; level++) {
    if (!currentUser?.referredBy) break;

    const parent = await User.findById(currentUser.referredBy).select("referredBy walletBalance");
    if (!parent) break;

    const commissionPercent = COMMISSIONS[level];
    const levelIncomeAmount = parseFloat(
      ((roiAmount * commissionPercent) / 100).toFixed(4)
    );

    try {
      await Referral.create({
        beneficiary: parent._id,
        sourceUser: investment.user,
        sourceInvestment: investment._id,
        sourceROI: roiEntry._id,
        level,
        commissionPercent,
        roiAmount,
        levelIncomeAmount,
        date: roiEntry.date,
      });

      await User.findByIdAndUpdate(parent._id, {
        $inc: { walletBalance: levelIncomeAmount, totalLevelIncome: levelIncomeAmount },
      });

      credited.push({ userId: parent._id, level, amount: levelIncomeAmount });
    } catch (err) {
      if (err.code !== 11000) throw err; // ignore duplicate, rethrow others
    }

    currentUser = parent;
  }

  return credited;
}

/**
 * Process ALL active investments for a given date.
 * This is called by the cron job.
 * Returns summary stats.
 */
async function processAllDailyROI(forDate = new Date()) {
  const date = toMidnightUTC(forDate);
  console.log(`[ROI] Processing ROI for date: ${date.toISOString()}`);

  const activeInvestments = await Investment.find({
    status: "ACTIVE",
    startDate: { $lte: date },
    endDate: { $gte: date },
  });

  console.log(`[ROI] Found ${activeInvestments.length} active investments`);

  let totalCredited = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  let totalAmount = 0;

  for (const investment of activeInvestments) {
    try {
      const result = await creditDailyROI(investment, date);
      if (result.credited) {
        totalCredited++;
        totalAmount += result.amount;
      } else {
        totalSkipped++;
      }
    } catch (err) {
      console.error(`[ROI] Error processing investment ${investment._id}:`, err.message);
      totalErrors++;
    }
  }

  const summary = {
    date: date.toISOString(),
    processed: activeInvestments.length,
    credited: totalCredited,
    skipped: totalSkipped,
    errors: totalErrors,
    totalAmountCredited: parseFloat(totalAmount.toFixed(4)),
  };

  console.log("[ROI] Summary:", summary);
  return summary;
}

module.exports = { creditDailyROI, creditLevelIncome, processAllDailyROI, toMidnightUTC };
