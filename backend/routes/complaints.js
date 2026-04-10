const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

// ── POST /api/complaints ──────────────────────────────────────────────────────
router.post('/', protect, upload.array('images', 3), async (req, res) => {
  try {
    const { title, description, category, shuttleId, priority } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }
    const images = req.files ? req.files.map(f => `/uploads/complaints/${f.filename}`) : [];
    const complaint = await Complaint.create({
      user: req.user._id,
      title, description,
      category: category || 'other',
      shuttleId,
      priority: priority || 'medium',
      images
    });
    res.status(201).json({
      success: true,
      message: `✅ Complaint submitted! Track it with ID: ${complaint.trackingId}`,
      complaint
    });
  } catch (err) {
    console.error('Complaint error:', err);
    res.status(500).json({ success: false, message: 'Failed to submit complaint.' });
  }
});

// ── GET /api/complaints/my ────────────────────────────────────────────────────
router.get('/my', protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch complaints.' });
  }
});

// ── GET /api/complaints/track/:trackingId ─────────────────────────────────────
router.get('/track/:trackingId', protect, async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ trackingId: req.params.trackingId })
      .populate('resolvedBy', 'name');
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found.' });
    res.json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to track complaint.' });
  }
});

module.exports = router;
