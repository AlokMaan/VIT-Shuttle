const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'rzp_test_YourKeyIdHere') return null;
  return new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
};

// Generate card number for a user if not present
function generateCardNumber() {
  return `4917 ${Math.floor(1000+Math.random()*9000)} ${Math.floor(1000+Math.random()*9000)} ${Math.floor(1000+Math.random()*9000)}`;
}

// ── GET /api/card — Get card details ──────────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    let user = await User.findById(req.user._id);
    // Auto-generate card if not present
    if (!user.cardNumber) {
      user.cardNumber = generateCardNumber();
      user.cardCvv = String(Math.floor(100 + Math.random() * 900));
      user.cardExpiry = '03/29';
      user.cardBalance = 0;
      await user.save();
    }
    res.json({
      success: true,
      card: {
        number: user.cardNumber,
        cvv: user.cardCvv,
        expiry: user.cardExpiry,
        balance: user.cardBalance,
        holder: user.name,
        regNo: user.regNo || '—',
      }
    });
  } catch (err) {
    console.error('Get card error:', err);
    res.status(500).json({ success: false, message: 'Failed to get card details.' });
  }
});

// ── GET /api/card/transactions — Get card transactions ─────────────────────────
router.get('/transactions', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, transactions: user.cardTransactions || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get transactions.' });
  }
});

// ── POST /api/card/topup — Create Razorpay order for top-up ────────────────────
router.post('/topup', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    const numAmount = Number(amount);
    if (!numAmount || numAmount < 10 || numAmount > 10000) {
      return res.status(400).json({ success: false, message: 'Amount must be between ₹10 and ₹10,000.' });
    }

    const razorpay = getRazorpay();
    const amountInPaise = numAmount * 100;

    if (!razorpay) {
      return res.status(500).json({ success: false, message: 'Payment gateway not configured.' });
    }

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `card_topup_${Date.now()}`,
      notes: { type: 'card_topup', userId: req.user._id.toString(), amount: numAmount },
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: amountInPaise,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID,
      topupAmount: numAmount,
    });
  } catch (err) {
    console.error('Card topup order error:', err);
    res.status(500).json({ success: false, message: 'Failed to create top-up order.' });
  }
});

// ── POST /api/card/verify-topup — Verify payment and add balance ───────────────
router.post('/verify-topup', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, topupAmount } = req.body;

    // Verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed.' });
    }

    // Add balance
    const numAmount = Number(topupAmount);
    const user = await User.findById(req.user._id);
    user.cardBalance = (user.cardBalance || 0) + numAmount;
    user.cardTransactions = [
      { type: 'credit', amount: numAmount, desc: 'Wallet Top-up via Razorpay', date: new Date(), paymentId: razorpay_payment_id },
      ...(user.cardTransactions || []),
    ];
    await user.save();

    res.json({
      success: true,
      message: `✅ ₹${numAmount} added successfully!`,
      newBalance: user.cardBalance,
    });
  } catch (err) {
    console.error('Card verify error:', err);
    res.status(500).json({ success: false, message: 'Top-up verification failed.' });
  }
});

module.exports = router;
