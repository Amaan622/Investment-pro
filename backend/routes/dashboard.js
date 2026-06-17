const express = require("express");
const Investment = require("../models/Investment");
const ROIHistory = require("../models/ROIHistory");
const Referral = require("../models/Referral");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const router = express.Router();

// GET /api/dashboard — user dashboard summary
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const [user, investments, roiHistory, levelIncome] = await Promise.all([
      User.findById(userId).select("-password"),
      Investment.find({ user: userId }).sort({ createdAt: -1 }),
      ROIHistory.find({ user: userId, type: "DAILY_ROI" })
        .sort({ date: -1 })
        .limit(30),
      Referral.find({ beneficiary: userId })
        .sort({ date: -1 })
        .limit(30),
    ]);

    const activeInvestments = investments.filter((i) => i.status === "ACTIVE");
    const totalActiveAmount = activeInvestments.reduce((s, i) => s + i.amount, 0);

    // Today's ROI (sum of today's entries)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayROI = roiHistory
      .filter((r) => new Date(r.date) >= todayStart)
      .reduce((s, r) => s + r.amount, 0);

    const todayLevelIncome = levelIncome
      .filter((r) => new Date(r.date) >= todayStart)
      .reduce((s, r) => s + r.levelIncomeAmount, 0);

    res.json({
      success: true,
      dashboard: {
        user: user.toSafeObject(),
        summary: {
          walletBalance: user.walletBalance,
          totalInvested: user.totalInvested,
          totalROIEarned: user.totalROIEarned,
          totalLevelIncome: user.totalLevelIncome,
          activeInvestments: activeInvestments.length,
          totalActiveAmount,
          todayROI,
          todayLevelIncome,
        },
        investments,
        recentROI: roiHistory,
        recentLevelIncome: levelIncome,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/dashboard/roi-history — paginated ROI history
router.get("/roi-history", protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const filter = { user: req.user._id };
    if (type) filter.type = type.toUpperCase();

    const history = await ROIHistory.find(filter)
      .sort({ date: -1 })
      .populate("investment", "plan amount")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ROIHistory.countDocuments(filter);
    res.json({ success: true, history, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/dashboard/referral-tree — nested referral tree (up to 5 levels)
router.get("/referral-tree", protect, async (req, res) => {
  try {
    const buildTree = async (userId, level = 1, maxLevel = 5) => {
      if (level > maxLevel) return [];
      const children = await User.find({ referredBy: userId }).select(
        "name email referralCode totalInvested totalROIEarned createdAt"
      );
      const tree = await Promise.all(
        children.map(async (child) => ({
          ...child.toObject(),
          level,
          children: await buildTree(child._id, level + 1, maxLevel),
        }))
      );
      return tree;
    };

    const tree = await buildTree(req.user._id);

    // Count totals per level
    const levelStats = {};
    const countLevels = (nodes) => {
      nodes.forEach((node) => {
        if (!levelStats[node.level]) levelStats[node.level] = { count: 0, totalInvested: 0 };
        levelStats[node.level].count++;
        levelStats[node.level].totalInvested += node.totalInvested;
        if (node.children?.length) countLevels(node.children);
      });
    };
    countLevels(tree);

    res.json({ success: true, tree, levelStats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
