const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Complaint title is required'],
    trim: true,
    maxlength: 120
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    enum: ['driver', 'bus_condition', 'punctuality', 'cleanliness', 'overcrowding', 'route', 'payment', 'other'],
    default: 'other'
  },
  shuttle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shuttle'
  },
  shuttleId: { type: String },
  images: [{ type: String }],
  status: {
    type: String,
    enum: ['pending', 'in_review', 'resolved', 'rejected'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  adminNotes: { type: String },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: { type: Date },
  trackingId: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generate tracking ID
complaintSchema.pre('save', function(next) {
  if (!this.trackingId) {
    const ts = Date.now().toString(36).toUpperCase();
    this.trackingId = `CMP-${ts}`;
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
