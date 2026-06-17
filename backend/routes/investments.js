const express = require("express");
const { body, validationResult } = require("express-validator");
const Investment = require("../models/Investment");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const router = express.Router();

// POST /api/investments — create new investment
router.post(
  "/",
  protect,
  [body("amount").isFloat({ min: 100 }).withMessage("Minimum investment is 100")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { amount } = req.body;
      const planEntry = Investment.getPlanForAmount(amount);

      if (!planEntry) {
        return res.status(400).json({ success: false, message: "Amount does not fit any plan" });
      }

      const [planKey, planDetails] = planEntry;
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + planDetails.durationDays);

      const investment = await Investment.create({
        user: req.user._id,
        amount,
        plan: planKey,
        dailyROIPercent: planDetails.dailyROIPercent,
        startDate,
        endDate,
      });

      // Update user's total invested
      await User.findByIdAndUpdate(req.user._id, { $inc: { totalInvested: amount } });

      res.status(201).json({ success: true, investment });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// GET /api/investments — list user's investments
router.get("/", protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status.toUpperCase();

    const investments = await Investment.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Investment.countDocuments(filter);
    res.json({ success: true, investments, total, page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/investments/:id — single investment detail
router.get("/:id", protect, async (req, res) => {
  try {
    const investment = await Investment.findOne({ _id: req.params.id, user: req.user._id });
    if (!investment) {
      return res.status(404).json({ success: false, message: "Investment not found" });
    }
    res.json({ success: true, investment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
