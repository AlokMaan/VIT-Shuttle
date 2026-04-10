const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Pass = require('../models/Pass');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const PASS_PRICES = {
  daily:   { amount: 2000,   label: 'Daily Pass',   days: 1 },
  monthly: { amount: 40000,  label: 'Monthly Pass',  days: 30 },
  yearly:  { amount: 300000, label: 'Yearly Pass',   days: 365 }
};

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'rzp_test_YourKeyIdHere') {
    return null;
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
};

// ── POST /api/payments/create-order ──────────────────────────────────────────
router.post('/create-order', protect, async (req, res) => {
  try {
    const { passType } = req.body;
    if (!PASS_PRICES[passType]) {
      return res.status(400).json({ success: false, message: 'Invalid pass type. Choose daily, monthly, or yearly.' });
    }

    const { amount, label } = PASS_PRICES[passType];
    const razorpay = getRazorpay();

    // Simulate if Razorpay keys not configured
    if (!razorpay) {
      const mockOrderId = `order_mock_${Date.now()}`;
      const payment = await Payment.create({
        user: req.user._id,
        razorpayOrderId: mockOrderId,
        amount,
        passType,
        status: 'created',
        notes: { passType, userId: req.user._id.toString(), label }
      });
      return res.json({
        success: true,
        simulated: true,
        message: '⚠️ Razorpay keys not configured — using simulation mode.',
        orderId: mockOrderId,
        amount,
        currency: 'INR',
        key: 'rzp_test_demo',
        passType,
        label,
        paymentDbId: payment._id
      });
    }

    const options = {
      amount,
      currency: 'INR',
      receipt: `vit_${passType}_${Date.now()}`,
      notes: {
        passType,
        userId: req.user._id.toString(),
        userName: req.user.name,
        userEmail: req.user.email
      }
    };

    const order = await razorpay.orders.create(options);

    const payment = await Payment.create({
      user: req.user._id,
      razorpayOrderId: order.id,
      amount,
      passType,
      status: 'created',
      notes: options.notes
    });

    res.json({
      success: true,
      orderId: order.id,
      amount,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID,
      passType,
      label,
      paymentDbId: payment._id
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ success: false, message: 'Failed to create payment order. Please try again.' });
  }
});

// ── POST /api/payments/verify ─────────────────────────────────────────────────
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentDbId } = req.body;

    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) return res.status(404).json({ success: false, message: 'Payment record not found.' });

    let isValid = true;

    // Verify signature if real Razorpay
    if (!payment.razorpayOrderId.startsWith('order_mock_')) {
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');
      isValid = expectedSignature === razorpay_signature;
    }

    if (!isValid) {
      payment.status = 'failed';
      await payment.save();
      return res.status(400).json({ success: false, message: 'Payment verification failed. Signature mismatch.' });
    }

    // Mark payment as paid
    payment.razorpayPaymentId = razorpay_payment_id || 'simulated';
    payment.razorpaySignature = razorpay_signature || 'simulated';
    payment.status = 'paid';
    payment.paidAt = new Date();
    await payment.save();

    // Create the pass
    const passConfig = PASS_PRICES[payment.passType];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + passConfig.days);

    const qrCode = `VIT-PASS-${req.user._id}-${payment._id}-${Date.now()}`;

    const pass = await Pass.create({
      user: req.user._id,
      type: payment.passType,
      price: payment.amount / 100,
      startDate,
      endDate,
      qrCode,
      paymentId: payment._id
    });

    // Update payment with pass
    payment.notes = { ...payment.notes, passId: pass._id.toString() };
    await payment.save();

    // Add notification to user
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        notifications: {
          message: `Your ${passConfig.label} is now active! Valid until ${endDate.toLocaleDateString('en-IN')}.`,
          type: 'success'
        }
      },
      $inc: { totalRides: 0 }
    });

    res.json({
      success: true,
      message: `🎉 Payment successful! Your ${passConfig.label} is now active.`,
      payment: {
        id: payment._id,
        receiptNumber: payment.receiptNumber,
        amount: payment.amount / 100,
        status: payment.status,
        paidAt: payment.paidAt
      },
      pass: {
        id: pass._id,
        type: pass.type,
        startDate: pass.startDate,
        endDate: pass.endDate,
        qrCode: pass.qrCode,
        daysRemaining: pass.daysRemaining
      }
    });
  } catch (err) {
    console.error('Verify payment error:', err);
    res.status(500).json({ success: false, message: 'Payment verification error. Contact support if amount was deducted.' });
  }
});

// ── GET /api/payments/history ─────────────────────────────────────────────────
router.get('/history', protect, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch payment history.' });
  }
});

// ── GET /api/payments/receipt/:id ────────────────────────────────────────────
router.get('/receipt/:id', protect, async (req, res) => {
  try {
    const payment = await Payment.findOne({ _id: req.params.id, user: req.user._id })
      .populate('user', 'name email regNo');
    if (!payment) return res.status(404).json({ success: false, message: 'Receipt not found.' });
    res.json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch receipt.' });
  }
});

module.exports = router;
