const express = require('express');
const router = express.Router();
const Pass = require('../models/Pass');
const { protect } = require('../middleware/auth');

// ── GET /api/passes/my ────────────────────────────────────────────────────────
router.get('/my', protect, async (req, res) => {
  try {
    const passes = await Pass.find({ user: req.user._id }).sort({ createdAt: -1 });
    // Auto-expire
    const now = new Date();
    for (const pass of passes) {
      if (pass.status === 'active' && pass.endDate < now) {
        pass.status = 'expired';
        await pass.save();
      }
    }
    res.json({ success: true, passes });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch passes.' });
  }
});

// ── GET /api/passes/active ────────────────────────────────────────────────────
router.get('/active', protect, async (req, res) => {
  try {
    const pass = await Pass.findOne({
      user: req.user._id,
      status: 'active',
      endDate: { $gte: new Date() }
    }).sort({ endDate: -1 });
    res.json({ success: true, pass });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch active pass.' });
  }
});

// ── GET /api/passes/verify/:qrCode ───────────────────────────────────────────
router.get('/verify/:qrCode', protect, async (req, res) => {
  try {
    const pass = await Pass.findOne({ qrCode: req.params.qrCode })
      .populate('user', 'name email regNo');
    if (!pass) {
      return res.status(404).json({ success: false, message: 'Pass not found. QR Code invalid.' });
    }
    const isActive = pass.status === 'active' && pass.endDate >= new Date();
    res.json({
      success: true,
      valid: isActive,
      pass,
      message: isActive ? '✅ Valid Pass' : '❌ Pass expired or cancelled'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to verify pass.' });
  }
});

module.exports = router;
