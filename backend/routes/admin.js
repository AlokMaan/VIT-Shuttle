const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Pass = require('../models/Pass');
const Payment = require('../models/Payment');
const Complaint = require('../models/Complaint');
const Shuttle = require('../models/Shuttle');
const ScanLog = require('../models/ScanLog');
const { protect, admin } = require('../middleware/auth');

// All admin routes require login + admin role
router.use(protect, admin);

// ── GET /api/admin/stats ──────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalPasses, totalRevenue, totalComplaints,
           activeShuttles, todayScans, pendingComplaints, todayRevenue] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Pass.countDocuments({ status: 'active', endDate: { $gte: new Date() } }),
      Payment.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Complaint.countDocuments(),
      Shuttle.countDocuments({ status: 'active' }),
      ScanLog.countDocuments({ scannedAt: { $gte: new Date(new Date().setHours(0,0,0,0)) } }),
      Complaint.countDocuments({ status: 'pending' }),
      Payment.aggregate([
        { $match: { status: 'paid', paidAt: { $gte: new Date(new Date().setHours(0,0,0,0)) } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalPasses,
        totalRevenue: totalRevenue[0] ? totalRevenue[0].total / 100 : 0,
        totalComplaints,
        activeShuttles,
        todayScans,
        pendingComplaints,
        todayRevenue: todayRevenue[0] ? todayRevenue[0].total / 100 : 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats.' });
  }
});

// ── GET /api/admin/users ──────────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const query = { role: 'student' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { regNo: { $regex: search, $options: 'i' } }
      ];
    }
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await User.countDocuments(query);
    res.json({ success: true, users, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
});

// ── PATCH /api/admin/users/:id/toggle ────────────────────────────────────────
router.patch('/users/:id/toggle', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}.`, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to toggle user status.' });
  }
});

// ── GET /api/admin/complaints ─────────────────────────────────────────────────
router.get('/complaints', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const complaints = await Complaint.find(query)
      .populate('user', 'name email regNo')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Complaint.countDocuments(query);
    res.json({ success: true, complaints, total });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch complaints.' });
  }
});

// ── PATCH /api/admin/complaints/:id ──────────────────────────────────────────
router.patch('/complaints/:id', async (req, res) => {
  try {
    const { status, adminNotes, priority } = req.body;
    const update = { status, adminNotes, priority };
    if (status === 'resolved') {
      update.resolvedBy = req.user._id;
      update.resolvedAt = new Date();
    }
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('user', 'name email');
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found.' });
    res.json({ success: true, message: 'Complaint updated.', complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update complaint.' });
  }
});

// ── GET /api/admin/payments ───────────────────────────────────────────────────
router.get('/payments', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const payments = await Payment.find({ status: 'paid' })
      .populate('user', 'name email regNo')
      .sort({ paidAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Payment.countDocuments({ status: 'paid' });
    res.json({ success: true, payments, total });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch payments.' });
  }
});

// ── GET /api/admin/scanlogs ───────────────────────────────────────────────────
router.get('/scanlogs', async (req, res) => {
  try {
    const { page = 1, limit = 30 } = req.query;
    const logs = await ScanLog.find()
      .populate('user', 'name email regNo')
      .populate('pass', 'type')
      .sort({ scannedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await ScanLog.countDocuments();
    res.json({ success: true, logs, total });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch scan logs.' });
  }
});

// ── POST /api/admin/shuttles ──────────────────────────────────────────────────
router.post('/shuttles', async (req, res) => {
  try {
    const shuttle = await Shuttle.create(req.body);
    res.status(201).json({ success: true, message: 'Shuttle added successfully.', shuttle });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'Bus ID already exists.' });
    res.status(500).json({ success: false, message: 'Failed to add shuttle.' });
  }
});

// ── PUT /api/admin/shuttles/:id ───────────────────────────────────────────────
router.put('/shuttles/:id', async (req, res) => {
  try {
    const shuttle = await Shuttle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!shuttle) return res.status(404).json({ success: false, message: 'Shuttle not found.' });
    res.json({ success: true, message: 'Shuttle updated.', shuttle });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update shuttle.' });
  }
});

// ── GET /api/admin/analytics/revenue ─────────────────────────────────────────
router.get('/analytics/revenue', async (req, res) => {
  try {
    const last7Days = await Payment.aggregate([
      { $match: { status: 'paid', paidAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$paidAt' } },
        revenue: { $sum: '$amount' },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    const passBreakdown = await Payment.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: '$passType', count: { $sum: 1 }, revenue: { $sum: '$amount' } } }
    ]);

    res.json({ success: true, last7Days, passBreakdown });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch analytics.' });
  }
});

module.exports = router;
