const cron = require("node-cron");
const { processAllDailyROI } = require("../services/roiService");

let isRunning = false; // prevent concurrent runs

/**
 * Runs daily at midnight (00:00) server time.
 * Idempotent: safe to rerun — duplicate ROI entries are silently skipped
 * via the unique index on (investment, date, type).
 */
const scheduleDailyROI = () => {
  // Cron syntax: second(optional) minute hour dayOfMonth month dayOfWeek
  // "0 0 * * *" = every day at midnight
  cron.schedule("0 0 * * *", async () => {
    if (isRunning) {
      console.warn("[CRON] ROI job already running — skipping this trigger");
      return;
    }

    isRunning = true;
    console.log(`[CRON] Daily ROI job started at ${new Date().toISOString()}`);

    try {
      const summary = await processAllDailyROI();
      console.log("[CRON] Daily ROI job completed:", summary);
    } catch (err) {
      console.error("[CRON] Daily ROI job failed:", err.message);
    } finally {
      isRunning = false;
    }
  });

  console.log("[CRON] Daily ROI scheduler registered (runs at midnight)");
};

/**
 * Manual trigger — useful for admin endpoints or backfill.
 * Accepts an optional date (defaults to today).
 */
const triggerROIManually = async (date) => {
  if (isRunning) {
    return { success: false, message: "Job already running" };
  }
  isRunning = true;
  try {
    const summary = await processAllDailyROI(date);
    return { success: true, summary };
  } catch (err) {
    return { success: false, message: err.message };
  } finally {
    isRunning = false;
  }
};

module.exports = { scheduleDailyROI, triggerROIManually };
