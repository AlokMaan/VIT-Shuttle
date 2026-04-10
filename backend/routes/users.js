const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Pass = require('../models/Pass');
const ScanLog = require('../models/ScanLog');
const Payment = require('../models/Payment');
const { protect } = require('../middleware/auth');

// ── GET /api/users/dashboard ──────────────────────────────────────────────────
router.get('/dashboard', protect, async (req, res) => {
  try {
    const [activePass, recentScans, recentPayments, unreadNotifs] = await Promise.all([
      Pass.findOne({ user: req.user._id, status: 'active', endDate: { $gte: new Date() } }).sort({ endDate: -1 }),
      ScanLog.find({ user: req.user._id }).sort({ scannedAt: -1 }).limit(5),
      Payment.find({ user: req.user._id, status: 'paid' }).sort({ paidAt: -1 }).limit(5),
      User.findById(req.user._id).select('notifications totalRides')
    ]);

    res.json({
      success: true,
      dashboard: {
        activePass,
        recentScans,
        recentPayments,
        totalRides: unreadNotifs?.totalRides || 0,
        notifications: unreadNotifs?.notifications?.filter(n => !n.isRead) || []
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard data.' });
  }
});

// ── PATCH /api/users/notifications/read ──────────────────────────────────────
router.patch('/notifications/read', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $set: { 'notifications.$[].isRead': true }
    });
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update notifications.' });
  }
});

module.exports = router;
