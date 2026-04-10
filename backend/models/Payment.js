const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  razorpayOrderId: {
    type: String,
    required: true,
    unique: true
  },
  razorpayPaymentId: {
    type: String,
    sparse: true
  },
  razorpaySignature: {
    type: String,
    sparse: true
  },
  amount: {
    type: Number,
    required: true // in paise (₹1 = 100 paise)
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['created', 'paid', 'failed', 'refunded'],
    default: 'created'
  },
  passType: {
    type: String,
    enum: ['daily', 'monthly', 'yearly'],
    required: true
  },
  receiptNumber: {
    type: String,
    unique: true
  },
  notes: {
    type: Object,
    default: {}
  },
  paidAt: { type: Date },
  refundedAt: { type: Date }
}, {
  timestamps: true
});

// Generate receipt number
paymentSchema.pre('save', function(next) {
  if (!this.receiptNumber) {
    const ts = Date.now().toString(36).toUpperCase();
    this.receiptNumber = `VIT-${ts}`;
  }
  next();
});

paymentSchema.virtual('amountInRupees').get(function() {
  return this.amount / 100;
});

paymentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Payment', paymentSchema);
