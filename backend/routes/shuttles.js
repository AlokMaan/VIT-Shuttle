const express = require('express');
const router = express.Router();
const Shuttle = require('../models/Shuttle');
const { protect } = require('../middleware/auth');

// ── GET /api/shuttles ─────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const shuttles = await Shuttle.find().sort({ busId: 1 });
    // Simulate live movement
    for (const s of shuttles) {
      if (s.status === 'active') {
        s.location.lat += (Math.random() - 0.5) * 0.001;
        s.location.lng += (Math.random() - 0.5) * 0.001;
        s.speed = Math.floor(Math.random() * 30) + 10;
        s.eta = Math.floor(Math.random() * 10) + 2;
        s.currentOccupancy = Math.floor(Math.random() * s.capacity);
        s.lastUpdated = new Date();
        await s.save();
      }
    }
    res.json({ success: true, shuttles });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch shuttles.' });
  }
});

// ── GET /api/shuttles/:id ─────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const shuttle = await Shuttle.findById(req.params.id);
    if (!shuttle) return res.status(404).json({ success: false, message: 'Shuttle not found.' });
    res.json({ success: true, shuttle });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch shuttle.' });
  }
});

module.exports = router;
