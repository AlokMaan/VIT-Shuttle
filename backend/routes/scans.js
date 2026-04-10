const express = require('express');
const router = express.Router();
const ScanLog = require('../models/ScanLog');
const Pass = require('../models/Pass');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// ── POST /api/scans ───────────────────────────────────────────────────────────
router.post('/', protect, async (req, res) => {
  try {
    const { qrCode, shuttleBusId, lat, lng, stopName, scanType } = req.body;
    if (!qrCode) return res.status(400).json({ success: false, message: 'QR code data is required.' });

    const pass = await Pass.findOne({ qrCode }).populate('user', 'name regNo email');
    if (!pass) {
      return res.status(404).json({
        success: false,
        status: 'invalid_pass',
        message: '❌ Invalid QR Code — pass not found in our system.'
      });
    }

    const now = new Date();
    const isExpired = pass.status !== 'active' || pass.endDate < now;
    if (isExpired) {
      await ScanLog.create({
        user: pass.user._id,
        pass: pass._id,
        shuttleBusId,
        location: { lat, lng, stopName },
        scanType: scanType || 'boarding',
        status: 'expired_pass'
      });
      return res.status(403).json({
        success: false,
        status: 'expired',
        message: `❌ Pass expired on ${pass.endDate.toLocaleDateString('en-IN')}. Please renew.`
      });
    }

    // Record scan
    const log = await ScanLog.create({
      user: pass.user._id,
      pass: pass._id,
      shuttleBusId,
      location: { lat, lng, stopName },
      scanType: scanType || 'boarding',
      status: 'success'
    });

    // Update pass
    pass.ridesUsed += 1;
    pass.lastUsed = now;
    await pass.save();

    // Increment user ride count
    await User.findByIdAndUpdate(pass.user._id, { $inc: { totalRides: 1 } });

    res.json({
      success: true,
      status: 'success',
      message: `✅ Valid! Welcome ${pass.user.name.split(' ')[0]}. Safe journey!`,
      scanLog: log,
      passHolder: {
        name: pass.user.name,
        regNo: pass.user.regNo,
        passType: pass.type,
        validUntil: pass.endDate,
        ridesUsed: pass.ridesUsed
      }
    });
  } catch (err) {
    console.error('Scan error:', err);
    res.status(500).json({ success: false, message: 'Scan failed. Please try again.' });
  }
});

// ── GET /api/scans/my ─────────────────────────────────────────────────────────
router.get('/my', protect, async (req, res) => {
  try {
    const logs = await ScanLog.find({ user: req.user._id })
      .sort({ scannedAt: -1 })
      .limit(30)
      .populate('pass', 'type')
      .select('-__v');
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch scan history.' });
  }
});

module.exports = router;
