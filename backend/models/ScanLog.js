const mongoose = require('mongoose');

const scanLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pass',
    required: true
  },
  shuttle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shuttle'
  },
  shuttleBusId: { type: String },
  location: {
    lat: { type: Number },
    lng: { type: Number },
    stopName: { type: String }
  },
  scanType: {
    type: String,
    enum: ['boarding', 'alighting'],
    default: 'boarding'
  },
  status: {
    type: String,
    enum: ['success', 'invalid_pass', 'expired_pass', 'fraud'],
    default: 'success'
  },
  deviceInfo: { type: String },
  scannedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('ScanLog', scanLogSchema);
